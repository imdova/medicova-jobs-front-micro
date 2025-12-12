"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

// Types
import { SkillData, UserProfile } from "@/types/seeker";

// UI Components
import { IconButton, TextField } from "@mui/material";
import { Add, Close } from "@mui/icons-material";

// Utils
import {
  createSkill,
  deleteSkill,
  fetchSkills,
} from "@/store/slices/skills.slice";
import SkillsSkeleton from "@/components/loading/skeleton-courses copy";

/* -------------------------------------------------------------------------- */
/*                                CONFIGURATION                               */
/* -------------------------------------------------------------------------- */

const SKILLS_LIMIT = 12;

const SeekerSkillsCard: React.FC<{ user: UserProfile }> = ({ user }) => {
  const dispatch = useAppDispatch();
  const { data: skills, fetching } = useAppSelector((state) => state.skills);
  useEffect(() => {
    if (!user.id) return;
    dispatch(fetchSkills(user.id));
  }, [dispatch, user.id]);

  const addSkill = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = e.currentTarget.skill.value;
    if (!value.trim()) return;
    const isDuplicated = skills.find((skill) => skill.name === value);
    if (isDuplicated) {
      return shake(isDuplicated.name);
    }
    e.currentTarget.skill.value = "";
    dispatch(createSkill({ seekerId: user.id, skill: { name: value } }));
  };
  const onDelete = (skill: Partial<SkillData>) => {
    if (skill.id) {
      dispatch(deleteSkill(skill.id));
    }
  };

  const [isShake, setIsShake] = useState<string | null>(null);
  function shake(name: string) {
    setIsShake(name);
    setTimeout(() => {
      setIsShake(null);
    }, 500);
  }

  const SkillsEmpty = skills.length === 0;

  return (
    <div className="mt-5 rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
      <div className="flex flex-col items-center justify-between md:flex-row">
        <h3 className="text-xl font-semibold text-main">Skills</h3>

        {/* TextField and Add Skill Button in the same row */}
        <form onSubmit={addSkill}>
          <TextField
            className="m-0 rounded"
            variant="outlined"
            name="skill"
            placeholder={
              skills.length >= SKILLS_LIMIT
                ? `Maximum Entry ${SKILLS_LIMIT} skill`
                : "Enter Skills"
            }
            disabled={skills.length >= SKILLS_LIMIT} // Disable if 12 skills are reached
            InputProps={{
              className: "p-0 rounded",
              endAdornment: (
                <IconButton
                  className="flex h-full w-[42px] items-center justify-center rounded"
                  type="submit"
                  disabled={skills.length >= SKILLS_LIMIT}
                >
                  <Add />
                </IconButton>
              ),
            }}
          />
        </form>
      </div>
      {fetching && SkillsEmpty ? (
        <SkillsSkeleton />
      ) : SkillsEmpty ? (
        <div className="p-5">
          <p className="text-center text-lg font-medium text-muted-foreground">
            No Skills Found
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Add Skills to show them here
          </p>
        </div>
      ) : (
        <div className="mt-2 flex flex-wrap">
          {skills.map((item) => (
            <div
              key={item.id + item.name}
              className={` ${isShake === item.name ? "animate-shake border-red-400" : "border-gray-200"} mb-2 mr-2 rounded-full border bg-primary/10 px-2 py-2 pl-4 text-main`}
            >
              <span>{item.name}</span>
              <IconButton
                size="small"
                className="ml-2 border border-solid border-gray-200 bg-white"
                disabled={String(item.id).startsWith("temp")}
                onClick={() => onDelete(item)}
              >
                <Close className="h-4 w-4" />
              </IconButton>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeekerSkillsCard;
