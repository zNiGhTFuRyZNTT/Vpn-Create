import subprocess
import argparse
import os
import random

class Vpn:
    def __init__(self, name=None, num=0):
        self.name = name
        self.num = num

    def _create_vpn(self):
        if not self.name : self.name = f"openvpn{random.randint(1, 1000)}"
        prc = subprocess.Popen(['./openvpn-install.sh',],
                             stdin=subprocess.PIPE,
                             stdout=subprocess.PIPE,
                             stderr=subprocess.PIPE)
        out, err = prc.communicate(input=f"1\n{self.name}\n1".encode('utf-8'))
        return out

    def _list_users(self):
        out = os.popen("tail -n +2 /etc/openvpn/easy-rsa/pki/index.txt | grep \"^V\" | cut -d '=' -f 2 | nl -s ') '")
        return out.read()

    def _revoke_vpn(self):
        prc = subprocess.Popen(['./openvpn-install.sh',],
                             stdin=subprocess.PIPE,
                             stdout=subprocess.PIPE,
                             stderr=subprocess.PIPE)
        out, err = prc.communicate(input=f"2\n{self.num}\n".encode('utf-8'))
        return out

    
if __name__ == '__main__':
    # - -- --- Set Arguments --- -- -
    parser = argparse.ArgumentParser()
    parser.add_argument('--name', type=str, required=False)
    parser.add_argument('--num', type=str, required=False)
    parser.add_argument('--action', type=str, required=True)
    args = parser.parse_args()

    # - -- --- Value Coontroll and Exceptions --- -- -
    if args.action == 'revoke' and not args.num: raise  ValueError("Please provide the number of the user to revoke.")
    if args.action == 'create' and not args.name: raise  ValueError("Please provide a name for the vpn you wish to create.")
    if args.action not in ['create', 'revoke', 'list']: raise Exception('Invalid Action: Action should be either \'create\' or \'revoke\' or \'list\'')

    # - -- --- Driver --- -- -
    if args.action == 'create':
        vpn = Vpn(args.name)
        res = vpn._create_vpn()
        print(res)

    elif args.action == 'revoke':
        vpn = Vpn(num=args.num)
        res = vpn._revoke_vpn().decode()
        message = res[res.find("Certificate for client"):]
        print(message)

    else:
        vpn = Vpn()
        res = vpn._list_users()
        print(res)

