public function store(Request $request)
{
    try {
        // Validate incoming request data
        $validated = $request->validate([
            'patientId' => 'required|exists:patients,patientId',

            // Consulting fields
            'visualAcuityFarPresentingRight' => 'nullable|max:1000',
            'visualAcuityFarPresentingLeft' => 'nullable|max:1000',
            'visualAcuityFarPinholeRight' => 'nullable|max:1000',
            'visualAcuityFarPinholeLeft' => 'nullable|max:1000',
            'visualAcuityFarBestCorrectedRight' => 'nullable|max:1000',
            'visualAcuityFarBestCorrectedLeft' => 'nullable|max:1000',
            'visualAcuityNearRight' => 'nullable|max:1000',
            'visualAcuityNearLeft' => 'nullable|max:1000',

            // ContinueConsulting fields
            'chiefComplaintRight' => 'nullable',
            'chiefComplaintLeft' => 'nullable',
            'intraOccularPressureRight' => 'nullable',
            'intraOccularPressureLeft' => 'nullable',
            'otherComplaintsRight' => 'nullable|max:1000',
            'otherComplaintsLeft' => 'nullable|max:1000',
            'detailedHistoryRight' => 'nullable|max:1000',
            'detailedHistoryLeft' => 'nullable|max:1000',
            'findingsRight' => 'nullable|max:1000',
            'findingsLeft' => 'nullable|max:1000',
            'eyelidRight' => 'nullable|max:1000',
            'eyelidLeft' => 'nullable|max:1000',
            'conjunctivaRight' => 'nullable|max:1000',
            'conjunctivaLeft' => 'nullable|max:1000',
            'corneaRight' => 'nullable|max:1000',
            'corneaLeft' => 'nullable|max:1000',
            'ACRight' => 'nullable|max:1000',
            'ACLeft' => 'nullable|max:1000',
            'irisRight' => 'nullable|max:1000',
            'irisLeft' => 'nullable|max:1000',
            'pupilRight' => 'nullable|max:1000',
            'pupilLeft' => 'nullable|max:1000',
            'lensRight' => 'nullable|max:1000',
            'lensLeft' => 'nullable|max:1000',
            'vitreousRight' => 'nullable|max:1000',
            'vitreousLeft' => 'nullable|max:1000',
            'retinaRight' => 'nullable|max:1000',
            'retinaLeft' => 'nullable|max:1000',
            'otherFindingsRight' => 'nullable|max:1000',
            'otherFindingsLeft' => 'nullable|max:1000',

            // Investigations fields
            'investigationsRequired' => 'nullable',
            'externalInvestigationRequired' => 'nullable',
            'investigationsDone' => 'nullable',
            'HBP' => 'nullable',
            'diabetes' => 'nullable',
            'pregnancy' => 'nullable',
            'drugAllergy' => 'nullable',
            'currentMedication' => 'nullable|max:1000',
            'documentId' => 'nullable|exists:document_upload,documentId',

            // Refraction fields
            'nearAddRight' => 'nullable|max:1000',
            'nearAddLeft' => 'nullable|max:1000',
            'refractionSphereRight' => 'nullable|max:1000',
            'refractionSphereLeft' => 'nullable|max:1000',
            'refractionCylinderRight' => 'nullable|max:1000',
            'refractionCylinderLeft' => 'nullable|max:1000',
            'refractionAxisRight' => 'nullable|max:1000',
            'refractionAxisLeft' => 'nullable|max:1000',
            'refractionPrismRight' => 'nullable|max:1000',
            'refractionPrismLeft' => 'nullable|max:1000',
            'lensType' => 'nullable|max:1000',
            'costOfLens' => 'nullable|numeric',
            'costOfFrame' => 'nullable|numeric',

            // Diagnosis fields
            'overallDiagnosisRight' => 'nullable',
            'overallDiagnosisLeft' => 'nullable',

            // Sketch fields
            'rightEyeFront' => 'nullable|string',
            'rightEyeBack' => 'nullable|string',
            'leftEyeFront' => 'nullable|string',
            'leftEyeBack' => 'nullable|string',

            // Treatments (arrays of objects)
            'eyeDrops' => 'nullable|array',
            'eyeDrops.*.medicine' => 'nullable|string',
            'eyeDrops.*.dosage' => 'nullable|string',
            'eyeDrops.*.doseDuration' => 'nullable|string',
            'eyeDrops.*.doseInterval' => 'nullable|string',
            'eyeDrops.*.comment' => 'nullable|string',

            'tablets' => 'nullable|array',
            'tablets.*.medicine' => 'nullable|string',
            'tablets.*.dosage' => 'nullable|string',
            'tablets.*.doseDuration' => 'nullable|string',
            'tablets.*.doseInterval' => 'nullable|string',
            'tablets.*.comment' => 'nullable|string',

            'ointments' => 'nullable|array',
            'ointments.*.medicine' => 'nullable|string',
            'ointments.*.dosage' => 'nullable|string',
            'ointments.*.doseDuration' => 'nullable|string',
            'ointments.*.doseInterval' => 'nullable|string',
            'ointments.*.comment' => 'nullable|string',
        ]);

        $result = DB::transaction(function () use ($validated, $request) {
            // Create child records (without encounterId yet)
            $consulting = Consulting::create([
                'patientId' => $validated['patientId'],
                'visualAcuityFarPresentingRight' => $validated['visualAcuityFarPresentingRight'] ?? null,
                'visualAcuityFarPresentingLeft' => $validated['visualAcuityFarPresentingLeft'] ?? null,
                'visualAcuityFarPinholeRight' => $validated['visualAcuityFarPinholeRight'] ?? null,
                'visualAcuityFarPinholeLeft' => $validated['visualAcuityFarPinholeLeft'] ?? null,
                'visualAcuityFarBestCorrectedRight' => $validated['visualAcuityFarBestCorrectedRight'] ?? null,
                'visualAcuityFarBestCorrectedLeft' => $validated['visualAcuityFarBestCorrectedLeft'] ?? null,
                'visualAcuityNearRight' => $validated['visualAcuityNearRight'] ?? null,
                'visualAcuityNearLeft' => $validated['visualAcuityNearLeft'] ?? null,
            ]);

            $continueConsulting = ContinueConsulting::create([
                'patientId' => $validated['patientId'],
                'chiefComplaintRight' => $validated['chiefComplaintRight'] ?? null,
                'chiefComplaintLeft' => $validated['chiefComplaintLeft'] ?? null,
                'intraOccularPressureRight' => $validated['intraOccularPressureRight'] ?? null,
                'intraOccularPressureLeft' => $validated['intraOccularPressureLeft'] ?? null,
                'otherComplaintsRight' => $validated['otherComplaintsRight'] ?? null,
                'otherComplaintsLeft' => $validated['otherComplaintsLeft'] ?? null,
                'detailedHistoryRight' => $validated['detailedHistoryRight'] ?? null,
                'detailedHistoryLeft' => $validated['detailedHistoryLeft'] ?? null,
                'findingsRight' => $validated['findingsRight'] ?? null,
                'findingsLeft' => $validated['findingsLeft'] ?? null,
                'eyelidRight' => $validated['eyelidRight'] ?? null,
                'eyelidLeft' => $validated['eyelidLeft'] ?? null,
                'conjunctivaRight' => $validated['conjunctivaRight'] ?? null,
                'conjunctivaLeft' => $validated['conjunctivaLeft'] ?? null,
                'corneaRight' => $validated['corneaRight'] ?? null,
                'corneaLeft' => $validated['corneaLeft'] ?? null,
                'ACRight' => $validated['ACRight'] ?? null,
                'ACLeft' => $validated['ACLeft'] ?? null,
                'irisRight' => $validated['irisRight'] ?? null,
                'irisLeft' => $validated['irisLeft'] ?? null,
                'pupilRight' => $validated['pupilRight'] ?? null,
                'pupilLeft' => $validated['pupilLeft'] ?? null,
                'lensRight' => $validated['lensRight'] ?? null,
                'lensLeft' => $validated['lensLeft'] ?? null,
                'vitreousRight' => $validated['vitreousRight'] ?? null,
                'vitreousLeft' => $validated['vitreousLeft'] ?? null,
                'retinaRight' => $validated['retinaRight'] ?? null,
                'retinaLeft' => $validated['retinaLeft'] ?? null,
                'otherFindingsRight' => $validated['otherFindingsRight'] ?? null,
                'otherFindingsLeft' => $validated['otherFindingsLeft'] ?? null,
            ]);

            $investigations = Investigation::create([
                'patientId' => $validated['patientId'],
                'investigationsRequired' => $validated['investigationsRequired'] ?? null,
                'externalInvestigationRequired' => $validated['externalInvestigationRequired'] ?? null,
                'investigationsDone' => $validated['investigationsDone'] ?? null,
                'HBP' => $validated['HBP'] ?? null,
                'diabetes' => $validated['diabetes'] ?? null,
                'pregnancy' => $validated['pregnancy'] ?? null,
                'drugAllergy' => $validated['drugAllergy'] ?? null,
                'currentMedication' => $validated['currentMedication'] ?? null,
                'documentId' => $validated['documentId'] ?? null,
            ]);

            $refraction = Refraction::create([
                'patientId' => $validated['patientId'],
                'nearAddRight' => $validated['nearAddRight'] ?? null,
                'nearAddLeft' => $validated['nearAddLeft'] ?? null,
                'refractionSphereRight' => $validated['refractionSphereRight'] ?? null,
                'refractionSphereLeft' => $validated['refractionSphereLeft'] ?? null,
                'refractionCylinderRight' => $validated['refractionCylinderRight'] ?? null,
                'refractionCylinderLeft' => $validated['refractionCylinderLeft'] ?? null,
                'refractionAxisRight' => $validated['refractionAxisRight'] ?? null,
                'refractionAxisLeft' => $validated['refractionAxisLeft'] ?? null,
                'refractionPrismRight' => $validated['refractionPrismRight'] ?? null,
                'refractionPrismLeft' => $validated['refractionPrismLeft'] ?? null,
                'lensType' => $validated['lensType'] ?? null,
                'costOfLens' => $validated['costOfLens'] ?? null,
                'costOfFrame' => $validated['costOfFrame'] ?? null,
            ]);

            $diagnosis = Diagnosis::create([
                'patientId' => $validated['patientId'],
                'overallDiagnosisRight' => $validated['overallDiagnosisRight'] ?? null,
                'overallDiagnosisLeft' => $validated['overallDiagnosisLeft'] ?? null,
            ]);

            $sketch = Sketch::create([
                'patientId' => $validated['patientId'],
                'rightEyeFront' => $validated['rightEyeFront'] ?? null,
                'rightEyeBack' => $validated['rightEyeBack'] ?? null,
                'leftEyeFront' => $validated['leftEyeFront'] ?? null,
                'leftEyeBack' => $validated['leftEyeBack'] ?? null,
            ]);

            // Save treatments (multiple rows)
            $treatments = [];
            foreach (['eyeDrops' => 'Eye Drop', 'tablets' => 'Tablet', 'ointments' => 'Ointment'] as $key => $type) {
                if ($request->has($key)) {
                    foreach ($request->$key as $row) {
                        $treatments[] = Treatment::create([
                            'patientId'     => $validated['patientId'],
                            'treatmentType' => $type,
                            'medicine'      => $row['medicine'] ?? null,
                            'dosage'        => $row['dosage'] ?? null,
                            'doseDuration'  => $row['doseDuration'] ?? null,
                            'doseInterval'  => $row['doseInterval'] ?? null,
                            'comment'       => $row['comment'] ?? null,
                        ]);
                    }
                }
            }

            // Create encounter
            $encounter = Encounters::create([
                'patientId'            => $validated['patientId'],
                'consultingId'         => $consulting->consultingId,
                'continueConsultingId' => $continueConsulting->continueConsultingId,
                'investigationId'      => $investigations->investigationId,
                'refractionId'         => $refraction->refractionId,
                'diagnosisId'          => $diagnosis->diagnosisId,
                'sketchId'             => $sketch->sketchId,
            ]);

            // Link child records
            $consulting->update(['encounterId' => $encounter->encounterId]);
            $continueConsulting->update(['encounterId' => $encounter->encounterId]);
            $investigations->update(['encounterId' => $encounter->encounterId]);
            $refraction->update(['encounterId' => $encounter->encounterId]);
            $diagnosis->update(['encounterId' => $encounter->encounterId]);
            $sketch->update(['encounterId' => $encounter->encounterId]);

            foreach ($treatments as $treatment) {
                $treatment->update(['encounterId' => $encounter->encounterId]);
            }

            return compact(
                'consulting',
                'continueConsulting',
                'investigations',
                'refraction',
                'diagnosis',
                'sketch',
                'treatments',
                'encounter'
            );
        });

        return response()->json([
            'message' => 'Encounter records created and linked successfully.',
            'data' => $result,
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Failed to create records: ' . $e->getMessage(),
        ], 500);
    }
}
