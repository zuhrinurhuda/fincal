import type { CalculatorConfig } from "../types/calculator";

import { kpr } from "./calculatorConfigs/kpr";
import { pph21 } from "./calculatorConfigs/pph21";
import { kreditMotor } from "./calculatorConfigs/kredit-motor";
import { kreditMobil } from "./calculatorConfigs/kredit-mobil";
import { pinjol } from "./calculatorConfigs/pinjol";
import { kur } from "./calculatorConfigs/kur";
import { investasi } from "./calculatorConfigs/investasi";
import { reksaDana } from "./calculatorConfigs/reksa-dana";
import { zakat } from "./calculatorConfigs/zakat";
import { pelunasanKpr } from "./calculatorConfigs/pelunasan-kpr";

export const calculatorRegistry: Record<string, CalculatorConfig> = {
  [kpr.slug]: kpr,
  [pph21.slug]: pph21,
  [kreditMotor.slug]: kreditMotor,
  [kreditMobil.slug]: kreditMobil,
  [pinjol.slug]: pinjol,
  [kur.slug]: kur,
  [investasi.slug]: investasi,
  [reksaDana.slug]: reksaDana,
  [zakat.slug]: zakat,
  [pelunasanKpr.slug]: pelunasanKpr,
};
