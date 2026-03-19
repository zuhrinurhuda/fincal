import type { CalculatorConfig } from "@/types/calculator";

import { kpr } from "@/config/calculatorConfigs/kpr";
import { pph21 } from "@/config/calculatorConfigs/pph21";
import { kreditMotor } from "@/config/calculatorConfigs/kredit-motor";
import { kreditMobil } from "@/config/calculatorConfigs/kredit-mobil";
import { pinjol } from "@/config/calculatorConfigs/pinjol";
import { kur } from "@/config/calculatorConfigs/kur";
import { investasi } from "@/config/calculatorConfigs/investasi";
import { reksaDana } from "@/config/calculatorConfigs/reksa-dana";
import { zakat } from "@/config/calculatorConfigs/zakat";
import { pelunasanKpr } from "@/config/calculatorConfigs/pelunasan-kpr";

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
