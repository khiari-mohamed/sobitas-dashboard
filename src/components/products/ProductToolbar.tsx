'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus } from 'react-icons/fa';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

interface ProductToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  category: string;
  onCategoryChange: (val: string) => void;
  categories: { _id: string; designation_fr?: string; designation?: string; title?: string }[];
  onAdd: () => void;
  selectedCount: number;
  onBulkDelete: () => void;
}

export default function ProductToolbar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  onAdd,
  selectedCount,
  onBulkDelete,
}: ProductToolbarProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <Input
          placeholder="Chercher un produit..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          className="w-full sm:w-64"
        />
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes les catégories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat._id} value={cat._id}>
                {cat.designation_fr || cat.designation || cat.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={onAdd}>
          <FaPlus className="mr-2" /> Ajouter un produit
        </Button>
        {selectedCount > 0 && (
          <Button variant="destructive" onClick={onBulkDelete}>
            Supprimer ({selectedCount})
          </Button>
        )}
      </div>
    </div>
  );
}
