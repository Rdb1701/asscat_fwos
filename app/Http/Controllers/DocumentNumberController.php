<?php

namespace App\Http\Controllers;

use App\Models\DocumentNumber;
use App\Http\Requests\StoreDocumentNumberRequest;
use App\Http\Requests\UpdateDocumentNumberRequest;
use Illuminate\Support\Facades\DB;

class DocumentNumberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = DocumentNumber::query();
        $document = $query->get();

        return inertia("Registrar/DocumentNumber/Index",[
            'documents_data' => $document,
            'success'        => session('success')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Registrar/DocumentNumber/Add');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDocumentNumberRequest $request)
    {
        $data = $request->validated();
        DocumentNumber::create($data);

        return to_route('document_number.index')->with('success', 'Successfully Created');
    }

    /**
     * Display the specified resource.
     */
    public function show(DocumentNumber $documentNumber)
    {
        
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DocumentNumber $documentNumber)
    {
        return inertia('Registrar/DocumentNumber/Edit', [
            'document_edit' => $documentNumber
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDocumentNumberRequest $request, DocumentNumber $documentNumber)
    {
        $data = $request->validated();
        $documentNumber->update($data);

        return to_route('document_number.index')->with('success', 'Successfully Updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DocumentNumber $documentNumber)
    {
        
        $documentNumber->delete();

        return to_route('document_number.index');
    }
}
