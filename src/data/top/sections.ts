import type { SectionData } from "../../types/section";

export const sections: SectionData[] = [
  {
    icon: "心",
    eyebrow: "Concept",
    titleLines: ["洞爺湖のほとりで、", "心ほどける時間を。"],
    description: [
      "ホテルグランドトーヤは、洞爺湖のほとりに佇む温泉宿です。",
      "湖畔の散策や周辺観光を楽しんだあとは、天然温泉でゆっくりと疲れを癒やす。気取らず、心地よく過ごせる滞在をご提供します。",
    ],
    centerText: true,
    showDivider: false,
    images: [
      { src: "/assets/photos/image12.jpg", alt: "館内のロビー", className: "h-full" },
      {
        src: "/assets/photos/image2.png",
        alt: "洞爺湖畔の花火",
        className: "h-[74%] self-end mt-0 lg:mt-[70px]",
      },
    ],
  },
  {
    id: "rooms",
    icon: "室",
    eyebrow: "Rooms",
    titleLines: ["旅のスタイルに合わせて選べる、多彩な客室。"],
    description: [
      "和室・洋室に加え、大人数でご利用いただける大広間もご用意しています。",
      "お一人様やご夫婦・ご家族での旅行はもちろん、修学旅行やスポーツ合宿、団体旅行まで、さまざまなご宿泊に対応いたします。",
    ],
    linkText: "客室のご案内",
    linkHref: "#",
    tallImagePosition: "left",
    images: [
      { src: "/assets/photos/image3.png", alt: "和室客室", caption: "和室" },
      { src: "/assets/photos/facility-4.jpg", alt: "客室からの眺め" },
      { src: "/assets/photos/facility-3.jpg", alt: "ホテル外観（夕景）", caption: "ホテル外観" },
    ],
  },
  {
    id: "onsen",
    icon: "湯",
    eyebrow: "Onsen",
    titleLines: ["源泉かけ流しの湯で、", "心も体もゆっくりと。"],
    description: [
      "保温性に優れた源泉かけ流しの天然温泉。",
      "熱め・ぬるめ・人肌の3つの浴槽で、お好みの湯加減をお楽しみいただけます。宿泊はもちろん、日帰り入浴でもご利用いただけます。",
    ],
    linkText: "温泉のご案内",
    linkHref: "#",
    tallImagePosition: "right",
    images: [
      { src: "/assets/photos/room-2.jpg", alt: "大浴場", caption: "大浴場" },
      { src: "/assets/photos/image9.png", alt: "露天風呂（夜景）" },
      { src: "/assets/photos/onsen-3.jpg", alt: "露天風呂", caption: "露天風呂" },
    ],
  },
  {
    id: "food",
    icon: "膳",
    eyebrow: "Dinner",
    titleLines: ["北海道の味覚を、", "ゆったりと味わう。"],
    description: [
      "ご夕食は会席膳、朝は和朝食をご用意。",
      "ご宿泊とともに、夕食・朝食をお楽しみいただけるプランをご用意しております。温泉とお食事で、ゆったりとしたひとときをお過ごしください。",
    ],
    linkText: "お料理のご案内",
    linkHref: "#",
    centerText: true,
    images: [
      { src: "/assets/photos/lobby-1.jpg", alt: "夕食のお料理", className: "h-full" },
      {
        src: "/assets/photos/lobby-2.jpg",
        alt: "お食事の一品",
        className: "h-[78%] self-end mb-0 lg:mb-14",
      },
    ],
  },
  {
    id: "facilities",
    icon: "館",
    eyebrow: "Facilities",
    titleLines: ["館内でも、", "快適なひとときを。"],
    description: [
      "ロビーや売店、喫茶スペースなどの館内施設に加え、多国籍スタッフによる多言語でのご案内にも対応。初めて洞爺湖を訪れる方や海外からのお客様にも、安心してお過ごしいただけます。",
    ],
    linkText: "館内施設・サービスを見る",
    linkHref: "#",
    tallImagePosition: "right",
    images: [
      { src: "/assets/photos/image4.png", alt: "客室からの眺め" },
      { src: "/assets/photos/image1.png", alt: "館内の様子" },
      { src: "/assets/photos/image5.png", alt: "客室からの眺め" },
    ],
  },
];
