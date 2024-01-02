---
title: airflow
author: tyk
date: 2023-02-15 13:25:45
tags:
---


1. 编译安装Python 3.11.2

    <https://airflow.apache.org/docs/apache-airflow/stable/installation/dependencies.html#system-dependencies>

    ```sh
    apt install libffi-dev libsqlite3-dev libssl-dev 
    ```

    ```sh
    ./configure --enable-loadable-sqlite-extensions
    make && make install
    ```

    ```sh
    ln -sf /usr/local/python3.11 /usr/bin/python3.11
    ln -sf /usr/local/python3.11 /usr/bin/python3
    ```

2. 安装airflow 2.5.1

    默认[PREINSTALLED_PROVIDERS](https://github.com/apache/airflow/blob/1cb127b9fd22a7dc8e0b82cab8acb7cd4c317c9c/setup.py#L697)
    
    ```
    pip install apache-airflow[all]==2.5.1 -c https://raw.githubusercontent.com/apache/airflow/constraints-2.5.1/constraints-3.11.txt -i http://mirrors.aliyun.com/pypi/simple/ 

    libmysqlclient-dev libpq-dev


    pip install apache-airflow[async,password,dingding,docker,elasticsearch,mongo,microsoft.mssql,mysql,oracle,postgres,redis,grpc,jdbc,ssh]==2.5.1 -c ./airflow-2.5.1-python-3.11-constraints.txt  --trusted-host mirrors.aliyun.com
    ```

### 参考
- [airflow-extra-dependencies](https://airflow.apache.org/docs/apache-airflow/stable/installation/dependencies.html#airflow-extra-dependencies)
- [extra-packages](https://airflow.apache.org/docs/apache-airflow/stable/extra-packages-ref.html)


```
FROM debian:11

# debian 11
# https://developer.aliyun.com/mirror/debian
RUN echo 'deb http://mirrors.aliyun.com/debian/ bullseye main non-free contrib \n \
deb-src http://mirrors.aliyun.com/debian/ bullseye main non-free contrib \n \
deb http://mirrors.aliyun.com/debian-security/ bullseye-security main \n \
deb-src http://mirrors.aliyun.com/debian-security/ bullseye-security main \n \
deb http://mirrors.aliyun.com/debian/ bullseye-updates main non-free contrib \n \
deb-src http://mirrors.aliyun.com/debian/ bullseye-updates main non-free contrib \n \
deb http://mirrors.aliyun.com/debian/ bullseye-backports main non-free contrib \n \
deb-src http://mirrors.aliyun.com/debian/ bullseye-backports main non-free contrib' \
> /etc/apt/sources.list

RUN apt update && apt install -y \
    libffi-dev \
    libsqlite3-dev \
    libssl-dev \
    libmariadb-dev \
    libpq-dev \
    python3 \
    python3-pip

ADD airflow-2.5.1-python-3.9-constraints.txt .

RUN pip install apache-airflow[async,password,dingding,docker,elasticsearch,mongo,microsoft.mssql,mysql,oracle,postgres,redis,grpc,jdbc,ssh]==2.5.1 \
    -c ./airflow-2.5.1-python-3.9-constraints.txt \
    -i http://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com

CMD ["airflow", "standalone"]



# apt install libffi-dev libsqlite3-dev libssl-dev libmysqlclient-dev libpq-dev python3 python3-pip
apt install libffi-dev libsqlite3-dev libssl-dev libmariadb-dev libpq-dev python3 python3-pip

# RUN wget https://www.python.org/ftp/python/3.11.2/Python-3.11.2.tgz -O Python-3.11.2.tgz \
#     && tar -zxvf Python-3.11.2.tgz \
#     && cd Python-3.11.2 && ./configure --enable-loadable-sqlite-extensions && make && make install && cd .. \
#     && ln -sf /usr/local/python3.11 /usr/bin/python3.11 \
#     && ln -sf /usr/local/python3.11 /usr/bin/python3 \
#     && rm -rf Python-3.11.2.tgz Python-3.11.2

# pip install apache-airflow[async,password,dingding,docker,elasticsearch,mongo,microsoft.mssql,mysql,oracle,postgres,redis,grpc,jdbc,ssh]==2.5.1 -c ./airflow-2.5.1-python-3.11-constraints.txt -i http://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com 

RUN AIRFLOW_VERSION=2.5.1
RUN PYTHON_VERSION="$(python3 --version | cut -d " " -f 2 | cut -d "." -f 1-2)"
# For example: 3.7
RUN CONSTRAINT_URL="https://raw.githubusercontent.com/apache/airflow/constraints-${AIRFLOW_VERSION}/constraints-${PYTHON_VERSION}.txt"
# For example: https://raw.githubusercontent.com/apache/airflow/constraints-2.5.1/constraints-3.7.txt
RUN pip install "apache-airflow==${AIRFLOW_VERSION}" --constraint "${CONSTRAINT_URL}"

```


pip install apache-airflow[async,password,dingding,docker,elasticsearch,mongo,microsoft.mssql,mysql,oracle,postgres,redis,grpc,jdbc,ssh]==2.5.1 -c ./airflow-2.5.1-python-3.9-constraints.txt -i http://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com 


```
airflow users delete -u admin
airflow users create --username admin --firstname admin --lastname admin --role Admin --email admin 
```
