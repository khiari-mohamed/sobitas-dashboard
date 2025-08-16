"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  FiFolder, FiChevronRight, FiChevronDown, FiUpload, FiDownload,
  FiFolderPlus, FiTrash, FiRepeat, FiScissors, FiCheckSquare
} from "react-icons/fi";
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import mediaService from "@/services/media";
import { Folder, Media } from "@/types/media";
import Modal from 'react-modal';
import { getCroppedImg } from '@/utils/cropImage';

export default function MediaManager() {
  const [folderTree, setFolderTree] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [selectMode, setSelectMode] = useState(false);
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState<Crop>({ unit: '%', x: 10, y: 10, width: 80, height: 60 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Crop | null>(null);
  const [croppingImage, setCroppingImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Fetch folder tree on mount
  useEffect(() => {
    mediaService.fetchFolderTree().then(setFolderTree);
  }, []);

  // Fetch media for selected folder
  useEffect(() => {
    if (selectedFolder) {
      console.log('Fetching media for folder:', selectedFolder);
      setLoading(true);
      mediaService.fetchMediaByFolder(selectedFolder)
        .then(data => {
          console.log('Media fetched for folder', selectedFolder, ':', data);
          setMediaList(data);
        })
        .finally(() => setLoading(false));
    } else {
      setMediaList([]);
    }
  }, [selectedFolder]);

  // Toggle folder expansion
  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  // Actions handlers
  const handleUpload = () => {
    if (!selectedFolder) return alert("Veuillez sélectionner un dossier pour l'upload.");
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !selectedFolder) return;
    const file = e.target.files[0];
    if (!file) return;
    await mediaService.uploadFile(file, selectedFolder);
    // Refresh media list
    setLoading(true);
    mediaService.fetchMediaByFolder(selectedFolder)
      .then(setMediaList)
      .finally(() => setLoading(false));
  };

  const handleAddFolder = async () => {
    const name = prompt("Nom du nouveau dossier:");
    if (!name) return;
    await mediaService.createFolder({ name, parentId: selectedFolder ?? null, id: `${Date.now()}` });
    // Refresh folder tree
    mediaService.fetchFolderTree().then(setFolderTree);
  };

  const handleDownload = () => {
    if (selectedMediaIds.length === 0) return alert("Sélectionnez un média à télécharger.");
    for (const id of selectedMediaIds) {
      mediaService.downloadFile(id);
    }
  };

  const handleMove = () => {
    alert("Fonction Déplacer à implémenter (sélectionnez un ou plusieurs médias, puis choisissez la destination)");
  };

  const handleDelete = async () => {
    if (selectedMediaIds.length === 0) return alert("Sélectionnez un média à supprimer.");
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer les médias sélectionnés ?")) return;
    for (const id of selectedMediaIds) {
      await mediaService.deleteMedia(id);
    }
    setSelectedMediaIds([]);
    setLoading(true);
    mediaService.fetchMediaByFolder(selectedFolder!).then(setMediaList).finally(() => setLoading(false));
  };

  const handleCrop = () => {
    if (selectedMediaIds.length !== 1) return;
    const media = mediaList.find(m => m.id === selectedMediaIds[0]);
    if (!media) return;
    const imagePath = media.id.startsWith('/produits') ? media.id : media.id.startsWith('public/') ? `/${media.id.replace('public/', 'uploads/')}` : media.id.startsWith('/') ? media.id : `/uploads/${media.id}`;
    setCroppingImage(imagePath);
    setCropModalOpen(true);
    setRotation(0);
    setZoom(1);
    setCrop({ unit: '%', x: 10, y: 10, width: 80, height: 60 });
    setCroppedAreaPixels(null);
  };

  const onCropComplete = (c: Crop) => {
    setCroppedAreaPixels(c);
  };

  const handleCropConfirm = async () => {
    if (!croppingImage || !croppedAreaPixels || selectedMediaIds.length !== 1) return;
    // Get the original image as a blob
    const image = await fetch(croppingImage).then(r => r.blob());
    const croppedBlob = await getCroppedImg(image, croppedAreaPixels, rotation);
    await mediaService.uploadFile(new File([croppedBlob], selectedMediaIds[0], { type: croppedBlob.type }), selectedFolder!);
    setCropModalOpen(false);
    setCroppingImage(null);
    setSelectedMediaIds([]);
    setLoading(true);
    mediaService.fetchMediaByFolder(selectedFolder!).then(setMediaList).finally(() => setLoading(false));
  };

  const handleCropCancel = () => {
    setCropModalOpen(false);
    setCroppingImage(null);
  };

  const handleSelectMultiple = () => {
    setSelectMode((prev) => !prev);
    setSelectedMediaIds([]);
  };

  // Folder operations: rename, delete
  const handleRenameFolder = async (folder: Folder) => {
    const newName = prompt("Nouveau nom du dossier:", folder.name);
    if (!newName || newName === folder.name) return;
    await mediaService.updateFolder(folder.id, { name: newName });
    mediaService.fetchFolderTree().then(setFolderTree);
  };
  const handleDeleteFolder = async (folder: Folder) => {
    if (!window.confirm(`Supprimer le dossier "${folder.name}" ?`)) return;
    await mediaService.deleteFolder(folder.id);
    if (selectedFolder === folder.id) setSelectedFolder(null);
    mediaService.fetchFolderTree().then(setFolderTree);
  };

  // Render folder tree recursively
  const renderFolderTree = (folders: Folder[] = []) => {
    if (folders.length === 0) return null;
    return (
      <ul className="pl-2">
        {folders.map(folder => {
          const hasChildren = folder.children && folder.children.length > 0;
          const isExpanded = expandedFolders[folder.id] ?? true;
          return (
            <li key={folder.id} className="mb-1">
              <div className="flex flex-col">
                <div className="flex items-center">
                  {hasChildren ? (
                    <button 
                      onClick={() => toggleFolder(folder.id)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      aria-label={isExpanded ? "Collapse folder" : "Expand folder"}
                    >
                      {isExpanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
                    </button>
                  ) : (
                    <div className="w-6" />
                  )}
                  <button
                    className={`flex items-center flex-1 text-left py-1 px-2 rounded ${
                      selectedFolder === folder.id 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedFolder(folder.id)}
                  >
                    <FiFolder className="mr-2 text-blue-500" />
                    <span className="truncate">{folder.name}</span>
                  </button>
                  {/* Folder actions */}
                  <div className="flex gap-1 ml-2">
                    <button title="Renommer" onClick={() => handleRenameFolder(folder)} className="text-xs text-gray-500 hover:text-blue-600 px-1">✏️</button>
                    <button title="Supprimer" onClick={() => handleDeleteFolder(folder)} className="text-xs text-gray-500 hover:text-red-600 px-1">🗑</button>
                  </div>
                </div>
                {hasChildren && isExpanded && (
                  <div className="ml-4">
                    {renderFolderTree(folder.children)}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  // Render media grid
  const renderMediaGrid = () => {
    if (loading) {
      return <div className="text-center py-12">Chargement...</div>;
    }

    if (mediaList.length === 0) {
      return <div className="col-span-full text-center text-gray-400 py-12">Aucun média dans ce dossier.</div>;
    }

    // Debug logging
    console.log('Media list:', mediaList.map(m => ({ id: m.id, generatedPath: m.id.startsWith('public/') ? `/${m.id.replace('public/', '')}` : m.id.startsWith('/') ? m.id : `/${m.id}` })));

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
        {mediaList.map(media => (
          <div key={media.id} className={`bg-gray-50 border rounded p-4 flex flex-col items-center ${selectMode && selectedMediaIds.includes(media.id) ? 'ring-2 ring-blue-500' : ''}`}>
            <div className="w-full flex items-center justify-center bg-white border mb-2" style={{ width: 360, height: 200, maxWidth: '100%' }}>
              <img
                src={media.id.startsWith('/produits') ? media.id : media.id.startsWith('public/') ? `/${media.id.replace('public/', 'uploads/')}` : media.id.startsWith('/') ? media.id : `/uploads/${media.id}`}
                alt={media.id}
                className="object-contain"
                style={{
                  width: '100%',
                  height: '100%',
                  maxWidth: 360,
                  maxHeight: 200,
                  ...(selectMode ? { cursor: 'pointer', border: selectedMediaIds.includes(media.id) ? '2px solid #3b82f6' : undefined } : {})
                }}
                onError={e => (e.currentTarget.src = "/images/placeholder.png")}
                onClick={() => {
                  if (selectMode) {
                    setSelectedMediaIds(ids => ids.includes(media.id) ? ids.filter(i => i !== media.id) : [...ids, media.id]);
                  }
                }}
              />
            </div>
            <div className="text-xs text-gray-700 truncate w-full text-center">{media.id}</div>
            <div className="text-xs text-gray-500">{media.width}x{media.height}px</div>
            <div className="text-xs text-gray-500">{(media.fileSize / 1024).toFixed(1)} KB</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1800px] mx-auto">
      {/* TOP HEADER */}
      <div className="flex flex-wrap gap-2 mb-4 p-4 bg-white border rounded">
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button onClick={handleUpload} className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          <FiUpload /> Upload
        </button>

        <button onClick={handleAddFolder} className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          <FiFolderPlus /> Ajouter un dossier
        </button>

        <button onClick={handleMove} className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
          <FiRepeat /> Déplacer
        </button>

        <button onClick={handleDelete} className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
          <FiTrash /> Supprimer
        </button>

        <button onClick={handleDownload} className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
          <FiDownload /> Télécharger
        </button>

        <button
          onClick={handleCrop}
          disabled={selectedMediaIds.length !== 1}
          className={`flex items-center gap-2 px-4 py-2 rounded ${selectedMediaIds.length === 1 ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
        >
          <FiScissors /> Rogner
        </button>

        <button onClick={handleSelectMultiple} className={`flex items-center gap-2 px-4 py-2 rounded ${selectMode ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}> 
          <FiCheckSquare /> Sélection multiple
        </button>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-col md:flex-row gap-6 w-full">
        {/* Sidebar: Folder tree */}
        <aside className="w-full md:w-64 bg-white border rounded p-4 h-fit md:sticky top-4">
          <h2 className="text-lg font-bold mb-4">Dossiers</h2>
          {folderTree.length > 0 ? renderFolderTree(folderTree) : <div className="text-gray-400">Aucun dossier</div>}
        </aside>

        {/* Main: Media grid */}
        <main className="flex-1 bg-white border rounded p-4 min-h-[600px]">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Gestion des médias</h1>
          </div>
          {renderMediaGrid()}
          {/* Crop Modal */}
          <Modal
            isOpen={cropModalOpen}
            onRequestClose={handleCropCancel}
            contentLabel="Crop Image"
            ariaHideApp={false}
            style={{
              overlay: { zIndex: 1000, background: 'rgba(0,0,0,0.5)' },
              content: { maxWidth: 600, margin: 'auto', borderRadius: 8 }
            }}
          >
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2">Rogner l'image</h2>
              {croppingImage && (
                <div className="relative w-full h-96 bg-gray-100 flex items-center justify-center">
                  <ReactCrop
                    crop={crop}
                    onChange={c => setCrop(c)}
                    onComplete={onCropComplete}
                    aspect={undefined} // freeform
                    circularCrop={false}
                    keepSelection={false}
                  >
                    <img
                      ref={imageRef}
                      src={croppingImage}
                      alt="Crop"
                      style={{
                        maxHeight: 350,
                        maxWidth: '100%',
                        transform: `scale(${zoom}) rotate(${rotation}deg)`,
                        transition: 'transform 0.1s',
                        display: 'block',
                        margin: '0 auto'
                      }}
                    />
                  </ReactCrop>
                </div>
              )}
              <div className="flex flex-col gap-2 mt-4">
                <label className="text-sm font-medium">Zoom</label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={e => setZoom(Number(e.target.value))}
                  className="w-full"
                />
                <label className="text-sm font-medium mt-2">Rotation</label>
                <input
                  type="range"
                  min={0}
                  max={360}
                  step={1}
                  value={rotation}
                  onChange={e => setRotation(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={handleCropCancel} className="px-4 py-2 bg-gray-200 rounded">Annuler</button>
              <button onClick={handleCropConfirm} className="px-4 py-2 bg-blue-600 text-white rounded">Rogner & Enregistrer</button>
            </div>
          </Modal>
        </main>
      </div>
    </div>
  );
}
