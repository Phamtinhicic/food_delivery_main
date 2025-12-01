FROM prom/prometheus:latest

# Copy Prometheus configuration
COPY prometheus.yml /etc/prometheus/prometheus.yml

# Railway uses dynamic PORT variable
ENV PORT=9090

# Expose Prometheus port
EXPOSE $PORT

# Start Prometheus on Railway's dynamic PORT
ENTRYPOINT ["/bin/sh", "-c"]
CMD ["prometheus --config.file=/etc/prometheus/prometheus.yml --storage.tsdb.path=/prometheus --web.console.libraries=/usr/share/prometheus/console_libraries --web.console.templates=/usr/share/prometheus/consoles --web.enable-lifecycle --web.listen-address=0.0.0.0:${PORT}"]
