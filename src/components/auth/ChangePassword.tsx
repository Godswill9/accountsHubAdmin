
import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { useToast } from '../../hooks/use-toast';
import { useAuth } from '../../contexts/AuthContext';

const ChangePassword: React.FC = () => {
  const { admin } = useAuth(); // Changed from user to admin
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const email = admin?.email || ''; // Changed from user to admin
      await authService.changePassword({ 
        email, 
        oldPassword: currentPassword, 
        newPassword 
      });
      
      toast({ title: 'Success', description: 'Password changed successfully', variant: 'default' });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to change password';
      toast({ title: 'Error', description: errorMsg, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="change-password-form">
      <h2>Change Password</h2>
      <input
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={handleChangePassword} disabled={isLoading}>
        {isLoading ? 'Changing...' : 'Change Password'}
      </button>
    </div>
  );
};

export default ChangePassword;
