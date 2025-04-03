import { execFile } from 'child_process';
import {
    Context,
    Handler,
    param,
    Types,
} from 'hydrooj';
import { Logger, logger } from 'hydrooj/src/logger';

class AddFromLojHandler extends Handler {
    @param('tid', Types.String)
    async get(tid: string) {
        const shellFile = './loj_download.sh';

        tid = tid.tid;
        execFile(shellFile, [tid], (error, stdout, stderr) => {
            if (error) {
                logger.error(`执行错误: ${error.message}`);
                return 1;
            }
            if (stderr) {
                logger.error(`Shell 错误输出: ${stderr}`);
                return 1;
            }
            logger.info(`Shell 输出: ${stdout}`);
            return 0;
        });
        this.response.template = 'add_success.html';
    }
}

export async function apply(ctx: Context) {
    // 注册一个名为 paste_create 的路由，匹配 '/paste/create'，
    // 使用PasteCreateHandler处理，访问改路由需要PRIV.PRIV_USER_PROFILE权限
    // 提示：路由匹配基于 path-to-regexp

    ctx.Route('add_from_loj', '/add_from/:tid', AddFromLojHandler);
}
