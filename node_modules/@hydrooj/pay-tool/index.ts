// @noErrors
// @module: esnext
// @filename: index.ts
import axios from 'axios';
import {
    Context,
    db, Handler, NotFoundError, param, PermissionError, PRIV, Types,
} from 'hydrooj';
import { logger } from 'hydrooj/src/logger';
import user, { User } from 'hydrooj/src/model/user';

const coll = db.collection('paste');

interface Paste {
    _id: string;
    owner: number;
    content: string;
    isPrivate: boolean;
}

declare module 'hydrooj' {
    interface Model {
        pastebin: typeof pastebinModel;
    }
    interface Collections {
        paste: Paste; // 声明数据表类型
    }
}

async function add(userId: number, content: string, isPrivate: boolean): Promise<string> {
    const pasteId = String.random(16); // Hydro 提供了此方法，创建一个长度为16的随机字符串
    // 使用 mongodb 为数据库驱动，相关操作参照其文档
    const result = await coll.insertOne({
        _id: pasteId,
        owner: userId,
        content,
        isPrivate,
    });
    return result.insertedId; // 返回插入的文档ID
}

async function get(pasteId: string): Promise<Paste> {
    return await coll.findOne({ _id: pasteId });
}

interface PurchaseRequest {
    user_id: string;
    item_id: string;
}

interface PurchaseResponse {
    has_purchased: boolean;
}


// 暴露这些接口，使得 cli 也能够正常调用这些函数；
const pastebinModel = { add, get };
global.Hydro.model.pastebin = pastebinModel;

// 创建新路由
class PasteCreateHandler extends Handler {
    // Get请求时触发该函数
    udoc: User;
    @param('tid', Types.String)
    async get(tid: string) {
        // 检查用户是否登录，此处为多余（因为底部注册路由时已声明所需权限）
        // 此方法适用于权限的动态检查
        // this.checkPriv(PRIV.PRIV_USER_PROFILE);

        this.udoc = await user.getById(this.domain._id, this.user._id);

        // const user_id = this.user._id.toString();
        // const item_id = tid;

        // const requestBody: PurchaseRequest = {
        //     user_id,
        //     item_id,
        // };

        this.response.body = {
            udoc: this.udoc,
            tid,
        };
        this.response.template = 'paste_create.html'; // 返回此页面
    }

    // 使用 Types.Content 检查输入
    @param('content', Types.Content)
    @param('private', Types.Boolean)
    // 从用户提交的表单中取出content和private字段
    // domainId 为固定传入参数
    async post(domainId: string, content: string, isPrivate = false) {
        // 在HTML表单提交的多选框中，选中值为 'on'，未选中则为空，需要进行转换
        const pasteid = await pastebinModel.add(this.user._id, content, !!isPrivate);
        // 将用户重定向到创建完成的url
        this.response.redirect = this.url('paste_show', { id: pasteid });
        // 相应的，提供了 this.back() 方法用于将用户重定向至前一个地址（通常用于 Ajax 或是部分更新操作）
    }
}

class PasteShowHandler extends Handler {
    @param('id', Types.String)
    async get(domainId: string, id: string) {
        const doc = await pastebin.get(id);
        if (!doc) throw new NotFoundError(id);
        if (doc.isPrivate && this.user._id !== doc.owner) {
            throw new PermissionError();
        }
        this.response.body = { doc };
        this.response.template = 'paste_show.html';
    }

    @param('id', Types.String)
    async postDelete(domainId: string, id: string) {
        // 当提交表单并存在 operation 值为 delete 时执行。
        // 本例中未实现删除功能，仅作为说明。
    }
}

// Hydro会在服务初始化完成后调用该函数。
export async function apply(ctx: Context) {
    // 注册一个名为 paste_create 的路由，匹配 '/paste/create'，
    // 使用PasteCreateHandler处理，访问改路由需要PRIV.PRIV_USER_PROFILE权限
    // 提示：路由匹配基于 path-to-regexp
    ctx.Route('paste_create', '/pay/:tid', PasteCreateHandler, PRIV.PRIV_USER_PROFILE);
    ctx.Route('paste_show', '/paste/show/:id', PasteShowHandler);
}

