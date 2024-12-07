import {
    BowlFood,
    ClockCounterClockwise,
    Icon,
    MagnifyingGlass,
    House,
    HeadCircuit,
    MonitorPlay,
} from "@phosphor-icons/react";

export enum Paths {
    HOME = "/",
    ARCHIVE = "/archive",
    SEARCH = "/search",
    WATCHPARTY = "/watchparty",
    AI = "/ai",
    DEKAMORI = "/dekamori",
}

export type Function = {
    path: Paths;
    icon: Icon;
    title: string;
    description: string;
    underConstruction: boolean;
};

export const functions: Function[] = [
    {
        path: Paths.HOME,
        icon: House,
        title: "ホーム",
        description: "",
        underConstruction: false,
    },
    {
        path: Paths.ARCHIVE,
        icon: ClockCounterClockwise,
        title: "祭アーカイブ",
        description:
            "過去の祭の一覧を閲覧、動画/音声を再生、トラックリストを確認することができます",
        underConstruction: false,
    },
    {
        path: Paths.SEARCH,
        icon: MagnifyingGlass,
        title: "祭インデックス",
        description: "祭のトラックリストを検索することができます",
        underConstruction: true,
    },
    {
        path: Paths.WATCHPARTY,
        icon: MonitorPlay,
        title: "祭ウォッチパーティ",
        description: "祭の動画/音声を一緒に視聴することができます",
        underConstruction: true,
    },
    {
        path: Paths.AI,
        icon: HeadCircuit,
        title: "祭AI",
        description: "祭の知識を備えたAIを利用することができます",
        underConstruction: true,
    },
    {
        path: Paths.DEKAMORI,
        icon: BowlFood,
        title: "デカ盛り美食大会",
        description: "デカ盛り美食大会",
        underConstruction: true,
    },
];
