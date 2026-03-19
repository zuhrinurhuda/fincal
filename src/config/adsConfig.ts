import type { AdsConfig } from "../types/calculator";

export const adsConfig: AdsConfig = {
  client:
    import.meta.env.PUBLIC_ADSENSE_CLIENT ?? "ca-pub-XXXXXXXXXXXXXXXX",
  slots: {
    top: import.meta.env.PUBLIC_SLOT_TOP ?? "0000000000",
    sidebar: import.meta.env.PUBLIC_SLOT_SIDEBAR ?? "0000000001",
    inArticle: import.meta.env.PUBLIC_SLOT_IN_ARTICLE ?? "0000000002",
    footer: import.meta.env.PUBLIC_SLOT_FOOTER ?? "0000000003",
  },
};
