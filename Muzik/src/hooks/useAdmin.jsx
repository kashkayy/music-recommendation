import { useCallback, useState } from "react";
import { toggleBan, toggleDemote, togglePromote } from "../api";
import { ROLE, SECTIONS } from "../admin/AdminSections";
import { Notify } from "../utils/toast";
export default function useAdmin(onChange) {
  const [pendingAction, setPendingAction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  //This function uses pendingAction state to store current action to be performed as well as target info into an object
  const handleActionClick = useCallback((action, target) => {
    setPendingAction({ action, user: target });
  }, []);

  const handleClose = useCallback(() => {
    setPendingAction(null);
  }, []);

  const handleConfirm = useCallback(async (action, target) => {
    setIsLoading(true);
    try {
      if (action === "demote") {
        await toggleDemote(target.id);
      } else if (action === "promote") {
        await togglePromote(target.id, ROLE.regionAdmin);
      } else if (action === "ban" || action === "unban") {
        await toggleBan(target.id, !target.isBanned);
      }
      //if action is completed call handleSectionChange(which re-fetches section data)
      if (onChange) {
        onChange(SECTIONS.USERS);
      }
    } catch (error) {
      Notify("Incomplete action: an error occured");
    } finally {
      setIsLoading(false);
      setPendingAction(null);
    }
  }, []);

  const handlePlaylistView = useCallback(() => {
    setPlaylistOpen(true);
  });

  const handlePlaylistClose = useCallback(() => {
    setPlaylistOpen(false);
  });
  return {
    handleActionClick,
    pendingAction,
    handleClose,
    handleConfirm,
    isLoading,
    playlistOpen,
    handlePlaylistView,
    handlePlaylistClose,
  };
}
