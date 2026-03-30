import { Injectable } from '@nestjs/common';
import { FieldMapping } from '../../modules/transaction/domain/entities/transaction.entity';
import type { ManualMapping } from '../types/common.types';

@Injectable()
export class FieldMapperService {
  /**
   * Mapeia campos do registro de origem para o modelo de destino,
   * aplicando conversões de tipo quando definidas.
   */
  map(
    source: Record<string, unknown>,
    fieldMapping: FieldMapping[],
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const mapping of fieldMapping) {
      const value = this.getNestedValue(source, mapping.exportField);
      result[mapping.importField] = this.transform(value, mapping.transform);
    }
    return result;
  }

  /**
   * Verifica se os campos mapeados existem no registro de origem.
   * Retorna compatibilidade e lista de campos ausentes.
   */
  checkCompatibility(
    source: Record<string, unknown>,
    fieldMapping: FieldMapping[],
  ): { compatible: boolean; missingFields: string[] } {
    const missingFields: string[] = [];
    for (const mapping of fieldMapping) {
      const value = this.getNestedValue(source, mapping.exportField);
      if (value === undefined || value === null) {
        missingFields.push(mapping.exportField);
      }
    }
    return { compatible: missingFields.length === 0, missingFields };
  }

  /** Suporta notação dot para campos aninhados. Ex: "address.city" */
  private getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    return path.split('.').reduce<unknown>((acc, key) => {
      if (acc !== null && typeof acc === 'object' && !Array.isArray(acc)) {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
  }

  private transform(value: unknown, transform?: FieldMapping['transform']): unknown {
    if (!transform || transform === 'none' || value == null) return value;

    switch (transform) {
      case 'toString':
        return String(value);
      case 'toNumber':
        return Number(value);
      case 'toBoolean':
        return Boolean(value);
      case 'toDate':
        return new Date(String(value));
      default:
        return value;
    }
  }

  /**
   * Compara os campos do sample de exportação com os do sample de importação.
   * - Chaves iguais → mapeamento automático
   * - Chaves sem correspondência + manualMappings fornecidos → resolve manualmente
   * - Chaves restantes sem mapeamento → retornadas em `unmatched`
   */
  autoMap(
    exportSample: Record<string, unknown>,
    importSample: Record<string, unknown>,
    manualMappings: ManualMapping[] = [],
  ): { fieldMapping: FieldMapping[]; unmatched: { exportKeys: string[]; importKeys: string[] } } {
    const exportKeys = Object.keys(exportSample);
    const importKeys = Object.keys(importSample);
    const fieldMapping: FieldMapping[] = [];
    const usedExportKeys = new Set<string>();
    const usedImportKeys = new Set<string>();

    // 1. Auto-mapear chaves com nomes idênticos
    for (const key of exportKeys) {
      if (importKeys.includes(key)) {
        fieldMapping.push({ exportField: key, importField: key, transform: 'none' });
        usedExportKeys.add(key);
        usedImportKeys.add(key);
      }
    }

    // 2. Aplicar mapeamentos manuais fornecidos pelo usuário
    for (const m of manualMappings) {
      fieldMapping.push({
        exportField: m.exportKey,
        importField: m.importKey,
        transform: m.transform ?? 'none',
      });
      usedExportKeys.add(m.exportKey);
      usedImportKeys.add(m.importKey);
    }

    // 3. Calcular o que ficou sem mapeamento
    const unmatchedExportKeys = exportKeys.filter((k) => !usedExportKeys.has(k));
    const unmatchedImportKeys = importKeys.filter((k) => !usedImportKeys.has(k));

    return {
      fieldMapping,
      unmatched: { exportKeys: unmatchedExportKeys, importKeys: unmatchedImportKeys },
    };
  }
}
