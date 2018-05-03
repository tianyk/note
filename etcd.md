curl https://discovery.etcd.io/new?size=3
https://discovery.etcd.io/fa80cfe460dbd80c5f71d082569b4358

export ETCD_INITIAL_CLUSTER="infra0=http://172.16.0.107:2380,infra1=http://172.16.16.222:2380"
export ETCD_INITIAL_CLUSTER_STATE=new

etcd --name infra0 --initial-advertise-peer-urls http://172.16.0.107:2380 \
    --listen-peer-urls http://172.16.0.107:2380 \
    --listen-client-urls http://172.16.0.107:2379,http://127.0.0.1:2379 \
    --advertise-client-urls http://172.16.0.107:2379 \
    --initial-cluster-token etcd-cluster-1

etcd --name infra1 --initial-advertise-peer-urls http://172.16.16.222:2380 \
    --listen-peer-urls http://172.16.16.222:2380 \
    --listen-client-urls http://172.16.16.222:2379,http://127.0.0.1:2379 \
    --advertise-client-urls http://172.16.16.222:2379 \
    --initial-cluster-token etcd-cluster-1