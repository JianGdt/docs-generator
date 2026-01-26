"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control } from "react-hook-form";
import { CommitFormValues } from "@/app/lib/schema/github";
import { Repository } from "@//lib/@types/github";

interface RepositorySelectProps {
  control: Control<CommitFormValues>;
  repositories: Repository[];
}

export function RepositorySelect({
  control,
  repositories,
}: RepositorySelectProps) {
  return (
    <FormField
      control={control}
      name="repository"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-black dark:text-white">
            Repository
          </FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={repositories.length === 0}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select repository" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {repositories.map((repo) => (
                <SelectItem
                  key={repo.id}
                  value={repo.fullName}
                  className="text-black dark:text-white"
                >
                  {repo.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
