import * as Actions from "../../actionCreators";
import { useActionCreator } from "../../hooks";
import { Node } from "../ContextMenu";
import ContextMenuTarget from "../ContextMenuTarget";

export default function RemoveMiscContextMenu() {
  const removeDuplicateTracks = useActionCreator(Actions.removeDuplicateTracks);

  return (
    <ContextMenuTarget
      style={{ width: "100%", height: "100%" }}
      top
      renderMenu={() => (
        <Node label="Remove duplicate tracks" onClick={removeDuplicateTracks} />
      )}
    >
      <div />
    </ContextMenuTarget>
  );
}
