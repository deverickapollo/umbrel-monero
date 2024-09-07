import { exec } from 'child_process';

const dockerService = {
    isBtcpayServerRunning() {
        return new Promise((resolve, reject) => {
          const command = "ping -c 1 'btcpay-server_web_1'";
          exec(command, (error, stdout, stderr) => {
            if (error) {
              resolve(false);
            } else {
              resolve(true);
            }
          });
        });
    },
};

export default dockerService;