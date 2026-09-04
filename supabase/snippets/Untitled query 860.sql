select min(created_at), max(created_at), count(*)
from public.ping_logs where monitor_id = '149e7f73-bca0-4631-9f55-bea5e7c80144';