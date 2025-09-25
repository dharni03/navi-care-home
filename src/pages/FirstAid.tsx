import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FirstAid: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>First Aid Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h2 className="font-semibold mb-2">CPR (Adults)</h2>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Check responsiveness and breathing. Call emergency services.</li>
              <li>Place heel of hand on center of chest, other hand on top.</li>
              <li>Press hard and fast: 100–120 compressions/min, depth ~5–6 cm.</li>
              <li>Allow full chest recoil; minimize interruptions.</li>
              <li>If trained, 30 compressions:2 rescue breaths.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold mb-2">Choking (Adults)</h2>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>If able to cough or speak, encourage coughing.</li>
              <li>If unable to breathe/speak: stand behind, give 5 back blows.</li>
              <li>Then 5 abdominal thrusts (Heimlich). Alternate 5/5 until relieved.</li>
              <li>If unresponsive, start CPR and check mouth for object.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold mb-2">Severe Bleeding</h2>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Apply direct pressure with clean cloth or bandage.</li>
              <li>Elevate the bleeding area if possible.</li>
              <li>Do not remove soaked dressings; add layers and keep pressing.</li>
              <li>Use a tourniquet for life-threatening limb bleeding if trained.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold mb-2">Burns</h2>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Cool burn under cool running water for 20 minutes.</li>
              <li>Do not use ice, butter, or creams. Do not pop blisters.</li>
              <li>Cover loosely with sterile, non-adhesive dressing.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold mb-2">Heart Attack</h2>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Chest pain/pressure, sweating, nausea, shortness of breath.</li>
              <li>Call emergency services immediately.</li>
              <li>Have the person rest; give aspirin (if not allergic, not contraindicated).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold mb-2">Stroke (FAST)</h2>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Face drooping, Arm weakness, Speech difficulty, Time to call emergency.</li>
              <li>Note time of symptom onset; do not give food/drink.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold mb-2">Fractures/Sprains</h2>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Immobilize the area; avoid moving the limb.</li>
              <li>RICE: Rest, Ice, Compression, Elevation.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold mb-2">Poisoning</h2>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Do not induce vomiting unless instructed by professionals.</li>
              <li>Identify the substance; call poison control/emergency services.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold mb-2">Seizures</h2>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Protect from injury; clear nearby objects.</li>
              <li>Do not restrain or put anything in the mouth.</li>
              <li>After seizure, place in recovery position; monitor breathing.</li>
            </ul>
          </section>

          <p className="text-xs text-muted-foreground">
            This guide is informational and not a substitute for professional training or medical care.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirstAid;



