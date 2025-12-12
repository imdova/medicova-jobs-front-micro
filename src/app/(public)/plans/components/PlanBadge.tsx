import React from 'react';
import { Box } from '@mui/material';
import { getBadgeStyles } from '../utils/planStyles';

interface PlanBadgeProps {
  planName: string;
  badge: string;
}

const PlanBadge: React.FC<PlanBadgeProps> = ({ planName, badge }) => {
  return (
    <Box sx={getBadgeStyles(planName)}>
      {badge}
    </Box>
  );
};

export default PlanBadge; 