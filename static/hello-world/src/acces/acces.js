import React, { useEffect, useState, useMemo } from "react";
import { invoke } from "@forge/bridge";
import { ButtonHeader } from "../core/header/button-header";
import Tag from "@atlaskit/tag";
import TagGroup from "@atlaskit/tag-group";
import { CheckboxSelect } from "@atlaskit/select";
import { Label } from "@atlaskit/form";
import Button from "@atlaskit/button/new";
import { useNavigate } from "react-router";

export const Acces = () => {
  const navigate = useNavigate();

  const [adminGroups, setAdminGroups] = useState([]);
  const [adminGroupsOptions, setAdminGroupsOptions] = useState([]);

  const [selectedGroups, setSelectedGroups] = useState([]);

  useEffect(() => {
    invoke("fetchAdminGroups").then(setAdminGroups);
  }, []);

  useEffect(() => {
    invoke("fetchAttlasianGroups").then((data) => {
      const adminGroupsShadow = [...adminGroups.map((a) => ({ ...a }))];
      const filteredGroups = data.filter((group) => !adminGroupsShadow.some((adminGroup) => adminGroup.name === group.label));
      setAdminGroupsOptions(filteredGroups);
    });
  }, [adminGroups]);

  const deleteGroup = async (groupId) => {
    await invoke("deleteAdminGroup", { id: groupId });
    navigate(0);
  };

  const addAdminGroups = async () => {
    await invoke("addAdminGroups", selectedGroups);
    invoke("fetchAdminGroups").then(setAdminGroups);
    setSelectedGroups([]);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <ButtonHeader activeIndex={2} />
      <p>This is the access page. You can manage user permissions and roles here.</p>

      <TagGroup>
        {adminGroups.map((group) => (
          <Tag
            testId={group.id}
            removeButtonLabel="Remove"
            text={group.name}
            isRemovable={group.canBeDeleted}
            color="blue"
            onAfterRemoveAction={() => deleteGroup(group.id)}
          />
        ))}
      </TagGroup>

      <div style={{ display: "flex", flexDirection: "column", marginTop: 16 }}>
        <Label htmlFor="checkbox-select-new-admin-group" style={{ marginBottom: 6 }}>
          Add Groups with access to Admin pannel
        </Label>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 400 }}>
            <CheckboxSelect
              options={adminGroupsOptions}
              placeholder="Choose a group"
              inputId="checkbox-select-new-admin-group"
              value={selectedGroups}
              onChange={setSelectedGroups}
            />
          </div>
          <Button appearance="primary" style={{ marginLeft: 8 }} isDisabled={!selectedGroups.length} onClick={addAdminGroups}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
