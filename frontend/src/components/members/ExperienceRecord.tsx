import React, { useCallback, useEffect, useState } from "react";
import tw from "twin.macro";
import api from "../../api";
import { Experience } from "../../models";
import { useAuth } from "../Layout";

interface ExperienceRecordProps {
  experiences: Array<Experience>;
  editable: boolean;
}

const exp_levels = {
  0: 'No Experience',
  1: 'Beginner (0-5 days)',
  2: 'Competent (5-20 days)',
  3: 'Experienced (20+ days)',
}

const activities = {
  'HW': 'Hillwalking',
  'WW': 'Winter Walking',
  'SC': 'Scrambling',
  'IC': 'Indoor Climbing',
  'IB': 'Indoor Bouldering',
  'OS': 'Sport Climbing',
  'OT': 'Trad Climbing',
  'WC': 'Winter Climbing',
  'ST': 'Ski Touring',
}

export default function ExperienceRecord({ experiences, editable }: ExperienceRecordProps) {
  const activitySet = Object.entries(activities).map( ([key, activity]) => {
    const matchingExperience = experiences.find(exp => exp.activity === key);

    if (editable) {
      return <EditableExperienceRow key={key} experience={matchingExperience}  activity={(activity as keyof typeof activities)} />
    } else {
      return <ExperienceRow key={key} experience={matchingExperience}  activity={(activity as keyof typeof activities)} />
    }
  });

  return (
    <div className="grid grid-cols-3 my-2">
      <ExperienceHeader>Activity</ExperienceHeader>
      <ExperienceHeader>Experience</ExperienceHeader>
      <ExperienceHeader>Other Info</ExperienceHeader>
      {activitySet}
    </div>
  )
}

const ExperienceHeader = tw.span`text-sm uppercase text-gray-500 font-bold`
const ExperienceValue = tw.span`text-sm my-1`
const ExperienceValueMissing = tw(ExperienceValue)`text-gray-500 italic`

interface ExperienceRowProps {
  activity: keyof typeof activities;
  experience: Experience | undefined;
}
function ExperienceRow({ activity, experience }: ExperienceRowProps) {
    return (
      <>
        <ExperienceValue>{activity}</ExperienceValue>
        {experience
          ? <ExperienceValue>{exp_levels[experience.competency]}</ExperienceValue>
          : <ExperienceValueMissing>No record.</ExperienceValueMissing>
        }
        {experience
          ? <ExperienceValue>{experience.info}</ExperienceValue>
          : <ExperienceValueMissing>No record.</ExperienceValueMissing>
        }
      </>
    )
}

function EditableExperienceRow({ activity, experience }: ExperienceRowProps) {
    const [competency, setCompetency] = useState(experience?.competency);
    const [otherInfo, setOtherInfo] = useState(experience?.info);
    const { refreshUser } = useAuth();

    const updateUser = useCallback(() => {
      let newExperience = Object.assign({}, experience);
      newExperience.activity = activity;
      if (competency) {
        newExperience.competency = competency;
      }
      newExperience.info = otherInfo;
      console.log('Posting new experience...');
      console.log(newExperience);

      refreshUser();
    }, [])


    return (
      <>
        <ExperienceValue>{activity}</ExperienceValue>
        <ExperienceValue>
          <select className="py-2 px-1" id="competency" value={competency} 
            onChange={event => {
              setCompetency((event.target.value as unknown as keyof typeof exp_levels));
              updateUser();
            }}>
            {Object.entries(exp_levels).map(([key, value]) => 
              <option key={key} value={key}>
                {value}
              </option>)}
          </select>
        </ExperienceValue>
        <ExperienceValue>
          <input className="py-2 px-1 shadow border rounded focus:shadow-outline"
            id="info" type="string" value={otherInfo} onChange={event => {
              setOtherInfo(event.target.value);
              updateUser();
            }} />
        </ExperienceValue>
      </>
    )
}
