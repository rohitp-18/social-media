"use client";

import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";

function Questions({
  questions,
  setQuestions,
  isActive,
  setIsActive,
  edit,
}: {
  questions: any[];
  setQuestions: React.Dispatch<React.SetStateAction<any[]>>;
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  edit: boolean;
}) {
  const [question, setQuestion] = useState("");
  const [questionType, setQuestionType] = useState("text");
  const [options, setOptions] = useState<string[]>([]);
  const [optionsText, setOptionsText] = useState("");

  const addQuestion = useCallback(() => {
    {
      if (question) {
        if (questions.some((q) => q.question === question)) {
          toast.error("Already entered question", {
            position: "top-center",
          });
        }
        setQuestions((prev) => [
          ...prev,
          { ques: question, type: questionType, options },
        ]);
        setQuestion("");
        setOptions([]);
        setOptionsText("");
      } else {
        toast.error("Please enter a question", {
          position: "top-center",
        });
      }
    }
  }, [question, questionType, options, questions, setQuestions]);

  const addOption = useCallback(() => {
    if (optionsText) {
      if (options.includes(optionsText)) {
        toast.error("Option already added", {
          position: "top-center",
        });
        return;
      }
      if (options.length > 5) {
        toast.error("Maximum 5 options allowed", {
          position: "top-center",
        });
        return;
      }
      setOptions((prev) => [...prev, optionsText]);
      setOptionsText("");
    } else {
      toast.error("Please enter options");
    }
  }, [optionsText, options, setOptions, setOptionsText]);

  return (
    <>
      <div className="grid w-full mb-2 gap-1">
        <Label htmlFor="question">Question</Label>
        <Input
          id="question"
          placeholder="Enter question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>
      <div className="grid w-full mb-2 gap-1">
        <Label htmlFor="questionType">Question Type</Label>
        <Select value={questionType} onValueChange={setQuestionType}>
          <SelectTrigger id="questionType">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {questionType === "multiple-choice" && (
        <div className="grid w-full mb-2 gap-1">
          <Label htmlFor="options">Options</Label>
          {options.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2 mt-1">
              {options.map((opt) => (
                <SpacialBadge
                  key={opt}
                  text={opt}
                  onClick={() =>
                    setOptions((prev) => prev.filter((o) => o !== opt))
                  }
                />
              ))}
            </div>
          )}
          <div className="flex gap-1 items-center mb-2">
            <Input
              id="options"
              placeholder="Enter options"
              value={optionsText}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addOption();
                }
              }}
              onChange={(e) => setOptionsText(e.currentTarget.value)}
            />
            <Button
              type="button"
              className="bg-primary/90 text-white hover:bg-primary"
              onClick={addOption}
            >
              Add
            </Button>
          </div>
        </div>
      )}
      <Button type="button" onClick={addQuestion}>
        Add Question
      </Button>
      <div className="mt-4">
        {questions.map((q) => (
          <div
            key={q.ques}
            className="relative border p-2 rounded-md mb-2 bg-gray-50"
          >
            <Button
              type="button"
              variant={"ghost"}
              size="icon"
              onClick={() =>
                setQuestions((prev) =>
                  prev.filter((question) => question.ques !== q.ques)
                )
              }
              className="absolute top-1 right-1 text-red-500 hover:text-red-700"
            >
              ✕
            </Button>
            <h3 className="font-semibold text-base">Q: {q.ques}</h3>
            {q.type === "multiple-choice" && q.options && (
              <ul className="list-disc pl-5 mt-1">
                {q.options.map((option: string, index: number) => (
                  <li key={index} className="text-gray-700">
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      {edit && (
        <div className="flex items-center justify-between gap-2 mt-2 bg-blue-50 p-2 rounded-md">
          <Label htmlFor="isActive">Is Active</Label>
          <button
            type="button"
            aria-label="Toggle Active Status"
            onClick={() => setIsActive((prev) => !prev)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
              isActive ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                isActive ? "transform translate-x-6" : ""
              }`}
            ></span>
          </button>
        </div>
      )}
    </>
  );
}

function SpacialBadge({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) {
  return (
    <Badge className="flex items-center gap-1 px-1 py-1 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md opacity-80">
      <span className="text-xs">{text}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-4 w-4 p-0.5 text-gray-500 hover:text-red-500"
        onClick={onClick}
      >
        ✕
      </Button>
    </Badge>
  );
}

export { SpacialBadge };

export default Questions;
