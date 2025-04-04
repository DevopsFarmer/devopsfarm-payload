"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getCourseData, CourseName, CourseData } from "./learningSection.server";
import { IconBrandWhatsapp, IconCircleDashedCheck } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";

const LearningSection = () => {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const [selectedCourse, setSelectedCourse] = useState<CourseData>({
    learnings: [],
    courseContent: [],
  });

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [, setActiveSubIndex] = useState<number | null>(null);
  const [src, setSrc] = useState<string>(`/image/${message}.gif`);

  const handleImageError = () => {
    setSrc(`/images/${message}.png`);
  };

  useEffect(() => {
    if (message) {
      setSrc(`/image/${message}.gif`);
    }
  }, [message]);

  useEffect(() => {
    const fetchData = async () => {
      if (message) {
        const courseName = message as CourseName;
        const courseData = await getCourseData(courseName);
        const formattedData = {
          ...courseData,
          courseContent: courseData.courseContent.map((content) => ({
            ...content,
            details: Array.isArray(content.details) ? content.details : [content.details],
          })),
        };
        setSelectedCourse(formattedData);
      }
    };

    fetchData();
  }, [message]);

  if (!selectedCourse) {
    return (
      <div className="h-96 max-w-screen-2xl pl-8 mx-auto flex flex-col justify-center border-b-[1px] border-gray-500 text-white items-center bg-white bg-clip-bg bg-transparent bg-logo-gradient">
        <h1 className="text-2xl md:text-6xl uppercase font-bold">Loading...</h1>
      </div>
    );
  }

  const toggleDropdown = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
    setActiveSubIndex(null);
  };


  return (
    <div className="grid pt-32 grid-cols-1 lg:grid-cols-3 bg-black gap-4 p-4 bg-clip-bg bg-transparent bg-logo-gradient">
      <div className="lg:col-span-2 p-4 w-fit h-fit">
        <h2 className="text-2xl font-bold mb-4 bg-black text-white">What You’ll Learn</h2>
        <ul className="list-none grid grid-cols-1 text-white md:grid-cols-2 bg-gray-900 opacity-70 rounded-lg p-8 gap-2">
          {selectedCourse.learnings.map((item: string, index: number) => (
            <li key={index} className="flex items-center space-x-2">
              <IconCircleDashedCheck width={20} height={20} className="w-8" stroke={2} />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 p-4">
          <h2 className="text-2xl font-bold mb-4 text-gray-100">Course Content</h2>
          <div className="space-y-2 text-white p-8 bg-gray-900 opacity-80 rounded-lg">
            {selectedCourse.courseContent.map((content, index) => (
              <div key={index}>
                <button
                  onClick={() => toggleDropdown(index)}
                  className="w-full text-left p-4 hover:bg-gray-700 rounded-lg flex justify-between items-center"
                >
                  <span>{content.chapter}</span>
                  <span>{activeIndex === index ? "▲" : "▼"}</span>
                </button>
                {activeIndex === index && (
                  <div className="p-4 bg-gray-500 text-gray-100 space-y-2">
                    {content.subpoints?.map((point: string, pointIndex: number) => (
                      <li key={pointIndex}>{point}</li>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
      </div>
      <div className="lg:col-span-1 p-4 h-fit mt-16 rounded-lg flex flex-col items-center text-center">
          <div className="relative inline-flex  overflow-hidden  p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center  bg-black px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            <Image
              src={src}
              width={400}
              height={400}
              alt="Course Image"
              className="mb-4  p-4 rounded-2xl"
              onError={handleImageError}
            /> </span>
          </div>

          <h2 className="text-xl font-bold mb-2 text-gray-100">
            Get Access To DevOpsFarm {message} Courses
          </h2>
          <p className="text-gray-400 mb-4">
            You’ll Get Access To 90+ Courses, 700+ Hands-On Labs, And 70+ Playgrounds.
          </p>
          <Link 
          href="https://wa.link/manbm0"
                target="_blank">
          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center">
            < IconBrandWhatsapp stroke={2} className="w-10 mr-2"/>
            Connect to WhatsApp
          </button></Link>
        </div>

    </div>
  );
};

export default LearningSection;


// href="https://wa.link/manbm0"