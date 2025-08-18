"use client";
import React, { useState, useRef } from "react";

// PC and mobile frontend slide images (from HeroCarousel)
const initialPCSlides = [
  "/images/hero/slides/sld1.jpg",
  "/images/hero/slides/sld2.jpg",
  "/images/hero/slides/sld3.jpg",
  "/images/hero/slides/sld4.jpg",
  "/images/hero/slides/4.webp",
];
const initialMobileSlides = [
  "/images/hero/slides/1m.webp",
  "/images/hero/slides/2m.webp",
  "/images/hero/slides/4m.webp",
];

export default function SlidesControlClient() {
  const [pcSlides, setPCSlides] = useState<string[]>(initialPCSlides);
  const [mobileSlides, setMobileSlides] = useState<string[]>(initialMobileSlides);
  const [newPCSlidePreview, setNewPCSlidePreview] = useState<string | null>(null);
  const [newMobileSlidePreview, setNewMobileSlidePreview] = useState<string | null>(null);
  const newPCSlideInputRef = useRef<HTMLInputElement>(null);
  const newMobileSlideInputRef = useRef<HTMLInputElement>(null);

  // Move slide up/down
  const moveSlide = (slides: string[], idx: number, direction: -1 | 1, setSlides: (s: string[]) => void) => {
    const newSlides = [...slides];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= slides.length) return;
    [newSlides[idx], newSlides[targetIdx]] = [newSlides[targetIdx], newSlides[idx]];
    setSlides(newSlides);
  };

  // Delete slide
  const deleteSlide = (slides: string[], idx: number, setSlides: (s: string[]) => void) => {
    setSlides(slides.filter((_, i) => i !== idx));
  };

  // Replace slide
  const replaceSlide = (slides: string[], idx: number, file: File, setSlides: (s: string[]) => void) => {
    const reader = new FileReader();
    reader.onload = () => {
      const newSlides = [...slides];
      // In production, upload file and use returned URL
      newSlides[idx] = reader.result as string;
      setSlides(newSlides);
    };
    reader.readAsDataURL(file);
  };

  // Add new slide
  const addSlide = (file: File, slides: string[], setSlides: (s: string[]) => void, setPreview: (s: string | null) => void, inputRef: React.RefObject<HTMLInputElement | null>) => {
    const reader = new FileReader();
    reader.onload = () => {
      setSlides([...slides, reader.result as string]);
      setPreview(null);
      if (inputRef.current) inputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto mt-8 border">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Contrôle des Slides Frontend</h1>
      {/* PC Slides Section */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Slides PC</h2>
        <div className="flex flex-wrap gap-6 mb-6">
          {pcSlides.map((src, idx) => (
            <div key={src + idx} className="flex flex-col items-center border p-4 rounded shadow-sm bg-gray-50">
              <img src={src} alt={`pc slide ${idx + 1}`} width={200} height={100} className="object-contain border rounded mb-2" />
              <span className="text-xs text-gray-500 mb-2">{src.split("/").pop()}</span>
              <div className="flex gap-2 mb-2">
                <button
                  className="px-2 py-1 bg-gray-200 rounded text-xs"
                  disabled={idx === 0}
                  onClick={() => moveSlide(pcSlides, idx, -1, setPCSlides)}
                >↑</button>
                <button
                  className="px-2 py-1 bg-gray-200 rounded text-xs"
                  disabled={idx === pcSlides.length - 1}
                  onClick={() => moveSlide(pcSlides, idx, 1, setPCSlides)}
                >↓</button>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                  onClick={() => deleteSlide(pcSlides, idx, setPCSlides)}
                >Supprimer</button>
              </div>
              <input
                type="file"
                accept="image/*"
                className="text-xs"
                onChange={e => {
                  if (e.target.files && e.target.files[0]) replaceSlide(pcSlides, idx, e.target.files[0], setPCSlides);
                }}
              />
              <span className="text-xs text-gray-400">Remplacer</span>
            </div>
          ))}
        </div>
        <h3 className="text-lg font-semibold mb-2">Ajouter un nouveau slide PC</h3>
        <input
          type="file"
          accept="image/*"
          ref={newPCSlideInputRef}
          onChange={e => {
            if (e.target.files && e.target.files[0]) {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.onload = () => setNewPCSlidePreview(reader.result as string);
              reader.readAsDataURL(file);
            }
          }}
          className="w-full border p-2 text-base mb-2"
        />
        {newPCSlidePreview && (
          <div className="flex flex-col items-center mt-2">
            <img src={newPCSlidePreview} alt="new pc slide preview" style={{ width: 200, height: 100, objectFit: 'contain' }} className="border rounded mb-2" />
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              onClick={() => {
                if (newPCSlideInputRef.current && newPCSlideInputRef.current.files && newPCSlideInputRef.current.files[0]) {
                  addSlide(newPCSlideInputRef.current.files[0], pcSlides, setPCSlides, setNewPCSlidePreview, newPCSlideInputRef);
                }
              }}
            >Ajouter ce slide PC</button>
          </div>
        )}
      </div>
      {/* Mobile Slides Section */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-green-700 mb-4">Slides Mobile</h2>
        <div className="flex flex-wrap gap-6 mb-6">
          {mobileSlides.map((src, idx) => (
            <div key={src + idx} className="flex flex-col items-center border p-4 rounded shadow-sm bg-gray-50">
              <img src={src} alt={`mobile slide ${idx + 1}`} width={200} height={100} className="object-contain border rounded mb-2" />
              <span className="text-xs text-gray-500 mb-2">{src.split("/").pop()}</span>
              <div className="flex gap-2 mb-2">
                <button
                  className="px-2 py-1 bg-gray-200 rounded text-xs"
                  disabled={idx === 0}
                  onClick={() => moveSlide(mobileSlides, idx, -1, setMobileSlides)}
                >↑</button>
                <button
                  className="px-2 py-1 bg-gray-200 rounded text-xs"
                  disabled={idx === mobileSlides.length - 1}
                  onClick={() => moveSlide(mobileSlides, idx, 1, setMobileSlides)}
                >↓</button>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                  onClick={() => deleteSlide(mobileSlides, idx, setMobileSlides)}
                >Supprimer</button>
              </div>
              <input
                type="file"
                accept="image/*"
                className="text-xs"
                onChange={e => {
                  if (e.target.files && e.target.files[0]) replaceSlide(mobileSlides, idx, e.target.files[0], setMobileSlides);
                }}
              />
              <span className="text-xs text-gray-400">Remplacer</span>
            </div>
          ))}
        </div>
        <h3 className="text-lg font-semibold mb-2">Ajouter un nouveau slide Mobile</h3>
        <input
          type="file"
          accept="image/*"
          ref={newMobileSlideInputRef}
          onChange={e => {
            if (e.target.files && e.target.files[0]) {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.onload = () => setNewMobileSlidePreview(reader.result as string);
              reader.readAsDataURL(file);
            }
          }}
          className="w-full border p-2 text-base mb-2"
        />
        {newMobileSlidePreview && (
          <div className="flex flex-col items-center mt-2">
            <img src={newMobileSlidePreview} alt="new mobile slide preview" style={{ width: 200, height: 100, objectFit: 'contain' }} className="border rounded mb-2" />
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              onClick={() => {
                if (newMobileSlideInputRef.current && newMobileSlideInputRef.current.files && newMobileSlideInputRef.current.files[0]) {
                  addSlide(newMobileSlideInputRef.current.files[0], mobileSlides, setMobileSlides, setNewMobileSlidePreview, newMobileSlideInputRef);
                }
              }}
            >Ajouter ce slide Mobile</button>
          </div>
        )}
      </div>
      <div className="text-lg text-gray-600">Les modifications ici ne sont effectives que sur le frontend. Pour gérer les slides du backend, utilisez la table principale.</div>
    </div>
  );
}
