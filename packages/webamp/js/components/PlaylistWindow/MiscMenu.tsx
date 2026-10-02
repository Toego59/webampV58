import PlaylistMenu from "./PlaylistMenu";
import SortContextMenu from "./SortContextMenu";
import MiscOptionsContextMenu from "./MiscOptionsContextMenu";
import RemoveMiscContextMenu from "./RemoveMiscContextMenu";
import * as Selectors from "../../selectors";
import * as Utils from "../../utils";
import { useTypedSelector } from "../../hooks";

const MiscMenu = () => {
  const selectedTracks = useTypedSelector(Selectors.getSelectedTrackObjects);

  const showFileInfo = () => {
    const track = selectedTracks[0];
    if (track == null) {
      window.alert("Select a track to view its information.");
      return;
    }

    const details = [
      `Title: ${track.title || track.defaultName || "Unknown"}`,
      `Artist: ${track.artist || "Unknown"}`,
      `Album: ${track.album || "Unknown"}`,
      `Duration: ${
        track.duration == null ? "Unknown" : Utils.getTimeStr(track.duration)
      }`,
      `Bitrate: ${track.kbps ? `${track.kbps} kbps` : "Unknown"}`,
      `Sample rate: ${track.khz || "Unknown"} kHz`,
      `Channels: ${track.channels ?? "Unknown"}`,
      `Location: ${track.url}`,
    ];
    window.alert(details.join("\n"));
  };

  return (
    <PlaylistMenu id="playlist-misc-menu">
      <div className="remove-misc" onClick={(e) => e.stopPropagation()}>
        <RemoveMiscContextMenu />
      </div>
      <div className="sort-list" onClick={(e) => e.stopPropagation()}>
        <SortContextMenu />
      </div>
      <div className="file-info" onClick={showFileInfo} />
      <div className="misc-options" onClick={(e) => e.stopPropagation()}>
        <MiscOptionsContextMenu />
      </div>
    </PlaylistMenu>
  );
};

export default MiscMenu;
