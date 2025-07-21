import { ACTIONS } from "../AdminSections";
import * as DropDownMenu from "@radix-ui/react-dropdown-menu";
import { getAvailableActions } from "../utils/getAvailableActions";
export default function AdminButtons({ requester, target }) {
  const availableActions = getAvailableActions(requester, target);
  return (
    <>
      <DropDownMenu.Root>
        <DropDownMenu.Trigger asChild>
          <button className="dropdown-trigger">...</button>
        </DropDownMenu.Trigger>
        <DropDownMenu.Content className="dropdown-content" sideOffset={5}>
          {availableActions.map((action) => (
            <DropDownMenu.Item key={action} className="dropdown-items">
              {ACTIONS[action]}
            </DropDownMenu.Item>
          ))}
        </DropDownMenu.Content>
      </DropDownMenu.Root>
    </>
  );
}
