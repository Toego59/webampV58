import { useCallback } from "react";
import type WebampLazy from "../../webamp/js/webampLazy";
import { selectRandomPreset } from "../../webamp/js/actionCreators/milkdrop";
import { toggleWindow } from "../../webamp/js/actionCreators/windows";
import { WINDOWS } from "../../webamp/js/constants";
// @ts-ignore
import iconUrl from "../images/manifest/icon-48x48.png";
import availableSkins from "./availableSkins";
import DesktopIcon from "./DesktopIcon";

const MUSEUM_GRAPHQL_URL = "https://skins.webamp.org/graphql";
const SKIN_COUNT_QUERY = `query { skins(sort: MUSEUM, first: 1) { count } }`;
const RANDOM_SKIN_QUERY = `
  query RandomSkin($offset: Int!) {
    skins(sort: MUSEUM, first: 1, offset: $offset) {
      nodes { download_url filename nsfw }
    }
  }
`;

interface MuseumSkin {
  download_url: string;
  filename: string;
  nsfw: boolean | null;
}

async function museumQuery<T>(
  query: string,
  variables?: Record<string, number>
): Promise<T> {
  const response = await fetch(MUSEUM_GRAPHQL_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  if (!response.ok) {
    throw new Error(`Museum request failed: ${response.status}`);
  }

  const result = (await response.json()) as {
    data?: T;
    errors?: unknown[];
  };
  if (result.data == null || result.errors?.length) {
    throw new Error("Museum returned an invalid skin response");
  }
  return result.data;
}

async function getRandomMuseumSkin(): Promise<MuseumSkin | null> {
  const { skins: countResult } = await museumQuery<{
    skins: { count: number };
  }>(SKIN_COUNT_QUERY);
  if (countResult.count < 1) {
    return null;
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    const offset = Math.floor(Math.random() * countResult.count);
    const { skins } = await museumQuery<{
      skins: { nodes: Array<MuseumSkin | null> };
    }>(RANDOM_SKIN_QUERY, { offset });
    const skin = skins.nodes.find(
      (candidate) =>
        candidate != null &&
        candidate.nsfw !== true &&
        candidate.download_url.startsWith("https://")
    );
    if (skin != null) {
      return skin;
    }
  }
  return null;
}

interface Props {
  webamp: WebampLazy;
}

export default function SurpriseIcon({ webamp }: Props) {
  const onOpen = useCallback(async () => {
    const state = webamp.store.getState();
    if (state.milkdrop.presets.length > 0) {
      if (!state.windows.genWindows[WINDOWS.MILKDROP]?.open) {
        webamp.store.dispatch(toggleWindow(WINDOWS.MILKDROP));
      }
      webamp.store.dispatch(selectRandomPreset());
    }

    const museumSkin = await getRandomMuseumSkin().catch(() => null);
    const skin =
      museumSkin ??
      availableSkins[Math.floor(Math.random() * availableSkins.length)];
    if (skin != null) {
      webamp.setSkinFromUrl(
        "download_url" in skin ? skin.download_url : skin.url
      );
    }
  }, [webamp]);

  return <DesktopIcon iconUrl={iconUrl} name="Surprise Mix" onOpen={onOpen} />;
}
