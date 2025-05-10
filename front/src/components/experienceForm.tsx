"use client";

import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface form {
  title?: string;
  update?: boolean;
}

function ExperienceForm() {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState<Date | null>();
  const [endDate, SetEndDate] = useState<Date | null | string>();
  const [working, setWorking] = useState(false);
  const [empType, setEmpType] = useState("");
  const [company, setCompany] = useState("");

  return (
    <form onSubmit={() => {}}>
      <div className="grid w-full mb-4 max-w-sm items-center gap-1">
        <Label htmlFor="title">Title</Label>
        <Input
          className="p-1"
          type="text"
          id="title"
          placeholder="add title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="grid w-full mb-4 max-w-sm items-center gap-1">
        <Label htmlFor="company">Company</Label>
        <Input
          className="p-1"
          type="text"
          id="company"
          placeholder="add Company"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
    </form>
  );
}

export default ExperienceForm;
