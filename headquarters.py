import subprocess
import argparse
import os

class Vpn:
    def __init__(self):
        pass

    def _create_vpn(self, name):
        prc = subprocess.Popen(['./openvpn-install.sh',],
                             stdin=subprocess.PIPE,
                             stdout=subprocess.PIPE,
                             stderr=subprocess.PIPE)
        out, err = prc.communicate(input=f"1\n{name}\n1".encode('utf-8'))
        out = out.decode()
        keyword ='added.'
        endindex = out.index(keyword)+len(keyword)
        message = out[endindex-28:endindex]
        return message


    def _list_users(self) -> str:
        out = os.popen("tail -n +2 /etc/openvpn/easy-rsa/pki/index.txt | grep \"^V\" | cut -d '=' -f 2 | nl -s ') '")
        return out.read()

    def _revoke_vpn(self, num):
        prc = subprocess.Popen(['./openvpn-install.sh',],
                             stdin=subprocess.PIPE,
                             stdout=subprocess.PIPE,
                             stderr=subprocess.PIPE)
        out, err = prc.communicate(input=f"2\n{num}\n".encode('utf-8'))
        return out
    
    def __call__(self, args):
        if args.action == 'create':
            res = self._create_vpn(args.name)
            print(res)

        elif args.action == 'revoke':
            users_list = self._list_users().strip().split()
            filename = users_list[users_list.index(f"{args.num})")+1]

            res = self._revoke_vpn(args.num).decode()
            message = res[res.find("Certificate for client"):]
            try:
                os.remove(f'./storage/{filename}.ovpn')
            except:
                pass
            print(message)

        else:
            res = self._list_users()
            print(res)



# - -- --- Driver --- -- -
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

    main = Vpn()
    try:
        main(args)
    except Exception as e:
        print(e)
