FROM postgres:16.0
USER postgres

# Copy postgres config file into container
COPY postgres-certs/ /etc/postgres/
COPY postgresql.conf /etc/postgres
COPY pg_hba.conf /etc/postgres/
WORKDIR /etc/postgres
USER root
RUN  chown postgres server.*  &&   chmod 0600 server.* &&  chown postgres root.* &&  chmod 0600 root.*
WORKDIR /etc/postgres/client
RUN  chown postgres postgresql.*  &&   chmod 0600 postgresql.*
WORKDIR /etc/postgres
USER postgres
# Override default postgres config file
CMD ["postgres", "-c", "config_file=/etc/postgres/postgresql.conf"]