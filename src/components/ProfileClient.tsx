'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Shield, Calendar, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import authService from '@/services/auth';

export default function ProfileClient() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    role: '',
    createdAt: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await authService.getProfile();
        
        if (response.user) {
          const profileData = {
            username: response.user.userName || authService.getUsername() || 'Admin User',
            email: response.user.email || 'admin@sobitas.com',
            role: response.user.role || authService.getRole() || 'admin',
            createdAt: response.user.createdAt ? new Date(response.user.createdAt).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR')
          };
          setProfile(profileData);
          setEditForm({
            username: profileData.username,
            email: profileData.email
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setError('Impossible de charger le profil');
        // Fallback to localStorage data
        const username = authService.getUsername() || 'Admin User';
        const role = authService.getRole() || 'admin';
        setProfile({
          username,
          email: 'admin@sobitas.com',
          role,
          createdAt: new Date().toLocaleDateString('fr-FR')
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600 mt-2">Gérez vos informations personnelles</p>
          {error && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
              {error} - Affichage des données locales
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{profile.username}</h2>
              <p className="text-gray-600">{profile.role}</p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Nom utilisateur</p>
                  <p className="font-medium text-gray-900">{profile.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{profile.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Rôle</p>
                  <p className="font-medium text-gray-900 capitalize">{profile.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Membre depuis</p>
                  <p className="font-medium text-gray-900">{profile.createdAt}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        {editMode && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Modifier le profil</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom utilisateur</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={async () => {
                    try {
                      setLoading(true);
                      await authService.updateProfile({
                        username: editForm.username,
                        email: editForm.email
                      });
                      
                      // Update localStorage
                      localStorage.setItem('admin_username', editForm.username);
                      
                      // Update local state
                      setProfile({...profile, username: editForm.username, email: editForm.email});
                      setEditMode(false);
                      alert('Profil mis à jour avec succès!');
                    } catch (error) {
                      console.error('Profile update failed:', error);
                      alert('Erreur lors de la mise à jour du profil');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
                <button 
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Modifier le profil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}