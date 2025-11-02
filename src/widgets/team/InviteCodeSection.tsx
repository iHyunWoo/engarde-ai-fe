'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/widgets/common/Card';
import { Input } from '@/widgets/common/Input';
import { Button } from '@/widgets/common/Button';
import { Copy, RefreshCw } from 'lucide-react';

interface InviteCodeSectionProps {
  inviteCode?: string | null;
  inviteCodeExpiresAt?: string | null;
  onRegenerate: () => void | Promise<void>;
  onCopy?: () => void;
}

export function InviteCodeSection({
  inviteCode,
  inviteCodeExpiresAt,
  onRegenerate,
  onCopy,
}: InviteCodeSectionProps) {
  const isExpired = inviteCodeExpiresAt
    ? new Date(inviteCodeExpiresAt) < new Date()
    : false;
  const needsRegeneration = !inviteCode || isExpired;

  const handleCopy = () => {
    if (inviteCode && onCopy) {
      onCopy();
    } else if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {needsRegeneration ? (
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800 mb-4">
              {!inviteCode ? 'No invite code generated yet.' : 'Invite code has expired.'}
            </p>
            <Button onClick={onRegenerate}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate Invite Code
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input value={inviteCode} readOnly className="font-mono" />
              {onCopy && (
                <Button variant="outline" onClick={handleCopy}>
                  <Copy className="w-4 h-4" />
                </Button>
              )}
              <Button variant="outline" onClick={onRegenerate}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
            </div>
            {inviteCodeExpiresAt && (
              <p className="text-xs text-muted-foreground">
                Expires at: {new Date(inviteCodeExpiresAt).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

