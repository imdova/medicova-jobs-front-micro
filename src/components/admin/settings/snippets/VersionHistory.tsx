'use client';

import { Dialog, DialogContent, DialogTitle, Button, Box, Typography, Paper, Tooltip } from '@mui/material';
import dayjs from 'dayjs';
import { Restore, Code, Person, AccessTime } from '@mui/icons-material';
import { useState } from 'react';

interface Version {
  id: string;
  snippetId: string;
  code: string;
  createdAt: Date;
  createdBy: string;
}

interface VersionHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  versions: Version[];
  onRestore: (version: Version) => void;
}

export function VersionHistory({ open, onOpenChange, versions, onRestore }: VersionHistoryProps) {
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);

  const handleRestore = (version: Version) => {
    onRestore(version);
    onOpenChange(false);
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => onOpenChange(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogContent>
        <DialogTitle sx={{ pb: 2 }}>Version History</DialogTitle>
        <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 200px)' }}>
          {/* Version List */}
          <Box sx={{ width: '40%', overflowY: 'auto', pr: 2 }}>
            {versions.map((version) => (
              <Paper
                key={version.id}
                elevation={selectedVersion?.id === version.id ? 3 : 1}
                sx={{
                  p: 2,
                  mb: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    elevation: 2,
                    transform: 'translateY(-2px)',
                  },
                  ...(selectedVersion?.id === version.id && {
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                  }),
                }}
                onClick={() => setSelectedVersion(version)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <AccessTime fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {dayjs(version.createdAt).format('MMMM D, YYYY h:mm A')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person fontSize="small" color="action" />
                  <Typography variant="body2">
                    {version.createdBy}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>

          {/* Version Details */}
          <Box sx={{ width: '60%', overflowY: 'auto' }}>
            {selectedVersion ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Version Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Created on {dayjs(selectedVersion.createdAt).format('MMMM D, YYYY h:mm A')}
                    </Typography>
                  </Box>
                  <Tooltip title="Restore this version">
                    <Button
                      variant="contained"
                      startIcon={<Restore />}
                      onClick={() => handleRestore(selectedVersion)}
                    >
                      Restore Version
                    </Button>
                  </Tooltip>
                </Box>
                <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Code fontSize="small" color="action" />
                    <Typography variant="subtitle2">Code Preview</Typography>
                  </Box>
                  <Box
                    component="pre"
                    sx={{
                      p: 2,
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      overflowX: 'auto',
                      fontSize: '0.875rem',
                      fontFamily: 'monospace',
                    }}
                  >
                    {selectedVersion.code}
                  </Box>
                </Paper>
              </>
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography color="text.secondary">
                  Select a version to view details
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
} 