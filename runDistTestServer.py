import http.server
import socketserver
import os
import socket
import ipaddress

def get_local_ips():
    local_ips = []
    try:
        # Get all network interfaces
        addrs = socket.getaddrinfo(socket.gethostname(), None)
        
        # Filter for IPv4 addresses in private subnets
        for addr in addrs:
            ip = addr[4][0]
            try:
                ip_obj = ipaddress.ip_address(ip)
                # Check if IP is in private ranges (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
                if ip_obj.is_private and ip_obj.version == 4:
                    local_ips.append(ip)
            except ValueError:
                continue
    except socket.gaierror:
        pass
    return sorted(set(local_ips))  # Remove duplicates and sort

PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler

os.chdir("dist")

local_ips = get_local_ips()
if local_ips:
    print("Your system's local IPs:", ", ".join(local_ips))
    print("\nAny of these IP addresses can be used to see the test site (provided they are routable).")
else:
    print("No local IPs found, if you are using this as a production server, PLEASE DONT")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    addr, port = httpd.server_address
    print(f"\n\nServing test server, listening on {addr}:{port}...\nYou can browse to http://localhost:{port}/")
    httpd.serve_forever()