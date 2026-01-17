"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { CommitFormValues } from "@/app/lib/schema/github";

interface PullRequestToggleProps {
  control: Control<CommitFormValues>;
}

export function PullRequestToggle({ control }: PullRequestToggleProps) {
  return (
    <FormField
      control={control}
      name="createPR"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
          <FormControl>
            <input
              type="checkbox"
              checked={field.value}
              onChange={field.onChange}
              className="w-4 h-4 rounded border-slate-600 bg-slate-900"
            />
          </FormControl>
          <FormLabel className="!mt-0 text-slate-200 font-normal">
            Create Pull Request instead of direct commit
          </FormLabel>
        </FormItem>
      )}
    />
  );
}
