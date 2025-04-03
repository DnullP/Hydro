import { log } from 'console';
import {
    Context,
    Handler,
    PRIV,
    query,
    Types,
} from 'hydrooj';
import { Logger, logger } from 'hydrooj/src/logger';
import domain from 'hydrooj/src/model/domain';
import user from 'hydrooj/src/model/user';

class UserlistHandler extends Handler {
    @query('page', Types.PositiveInt, true)
    async get(domainId: string, page = 1) {
        const [dudocs, upcount, ucount] = await this.paginate(
            domain.getMultiUserInDomain(domainId, { uid: { $gt: 1 } }).sort({ uid: 1 }),
            page,
            'ranking',
        );
        const udict = await user.getList(domainId, dudocs.map((dudoc) => dudoc.uid));
        const udocs = dudocs.map((i) => udict[i.uid]).filter((udoc) => udoc._udoc.del !== true);
        console.log(udocs);
        this.response.template = 'userlist.html';
        this.response.body = {
            udocs, upcount, ucount, page,
        };
    }
}

class UserBanHandler extends Handler {
    async get(uid: any) {
        user.ban(Number(uid.uid), '账号已被停用');
        user.setById(Number(uid.uid), { del: true });
        this.response.redirect = this.url('user_list');
        this.back();
    }
}

class UserResetHandler extends Handler {
    async get(uid: any) {
        user.setPassword(Number(uid.uid), '123456');
        this.response.redirect = this.url('user_list');
        this.back();
    }
}

export async function apply(ctx: Context) {
    // 注册一个名为 paste_create 的路由，匹配 '/paste/create'，
    // 使用PasteCreateHandler处理，访问改路由需要PRIV.PRIV_USER_PROFILE权限
    // 提示：路由匹配基于 path-to-regexp

    ctx.Route('userList', '/user_list', UserlistHandler, PRIV.PRIV_ALL);
    ctx.Route('userBan', '/user_ban/:uid', UserBanHandler, PRIV.PRIV_ALL);
    ctx.Route('userReset', '/user_reset/:uid', UserResetHandler, PRIV.PRIV_ALL);
}
