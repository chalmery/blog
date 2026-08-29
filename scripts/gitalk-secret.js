"use strict";

// Gitalk Client ID / Client Secret 通过环境变量注入（GitHub Actions Secrets），
// 避免明文写入公开仓库源码，换电脑也不丢失。
hexo.on("generateBefore", function () {
  const clientID = process.env.GITALK_CLIENT_ID;
  const secret = process.env.GITALK_SECRET;

  const gitalk = hexo.theme.config.comment?.config?.gitalk;
  if (!gitalk) {
    hexo.log.warn("[gitalk] 未找到 comment.config.gitalk 配置");
    return;
  }

  if (clientID) {
    gitalk.clientID = clientID;
  }
  if (secret) {
    gitalk.clientSecret = secret;
  }

  if (!clientID || !secret) {
    hexo.log.warn(
      "[gitalk] 环境变量未完整设置（需要 GITALK_CLIENT_ID 和 GITALK_SECRET），评论可能无法正常显示"
    );
  } else {
    hexo.log.info("[gitalk] Gitalk 凭据已从环境变量注入");
  }
});
