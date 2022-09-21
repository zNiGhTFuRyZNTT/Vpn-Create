x = """ 
stdout: Welcome to OpenVPN-install!
The git repository is available at: https://github.com/angristan/openvpn-install

It looks like OpenVPN is already installed.

What do you want to do?
   1) Add a new user
   2) Revoke existing user
   3) Remove OpenVPN
   4) Exit

Tell me a name for the client.
The name must consist of alphanumeric character. It may also include an underscore or a dash.

Do you want to protect the configuration file with a password?
(e.g. encrypt the private key with a password)
   1) Add a passwordless client
   2) Use a password for the client

Note: using Easy-RSA configuration from: /etc/openvpn/easy-rsa/vars
Using SSL: openssl OpenSSL 1.1.1n  15 Mar 2022 (Library: OpenSSL 1.1.1l  24 Aug 2021)

Client bcy-TEST444-215 added.

The configuration file has been written to /home/nightfury/Documents/GitHub/Vpn-Create/storage/bcy-TEST444-215.ovpn.
Download the .ovpn file and import it in your OpenVPN client.
    """
keyword='added.'
endindex = x.index(keyword)+len(keyword)
print(endindex)
print(x[endindex-28:endindex])