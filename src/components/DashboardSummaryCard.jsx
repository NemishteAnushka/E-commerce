import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

export default function DashboardSummaryCard({ label, value, bgcolor }) {
  return (
    <Card sx={{ bgcolor, borderRadius: 3, boxShadow: 1 }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>{value}</Typography>
      </CardContent>
    </Card>
  );
}
