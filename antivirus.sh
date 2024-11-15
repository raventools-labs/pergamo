#/bin/sh

if [ "$ENABLE_ANTIVIRUS" = "true" ]; then
  freshclam
  freshclam -d
  clamd
fi