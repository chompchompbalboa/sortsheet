<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

use App\Models\Sheet;
use App\Models\SheetFilter;
use App\Models\SheetGroup;
use App\Models\SheetSort;
use App\Models\SheetView;

class SheetViewController extends Controller
{
    public function store(Request $request)
    {
      // View
      $newSheetViewId = $request->input('id');
      $sheetId = $request->input('sheetId');
      $newSheetView = SheetView::create([ 
        'id' => $request->input('id'), 
        'sheetId' => $request->input('sheetId'),
        'name' => $request->input('name'),
        'visibleColumns' => $request->input('visibleColumns'),
      ]);

      // Update the sheet's active sheet view id
      $sheet = Sheet::find($sheetId);
      $sheet->activeSheetViewId = $newSheetView->id;
      $sheet->save();

      // Filters
      $newSheetViewFilters = $request->input('filters');
      foreach($newSheetViewFilters as $sheetViewFilter) {
        $newSheetView->filters()->create($sheetViewFilter);
      }

      // Groups
      $newSheetViewGroups = $request->input('groups');
      foreach($newSheetViewGroups as $sheetViewGroup) {
        $newSheetView->groups()->create($sheetViewGroup);
      }
      
      // Sorts
      $newSheetViewSorts = $request->input('sorts');
      foreach($newSheetViewSorts as $sheetViewSort) {
        $newSheetView->sorts()->create($sheetViewSort);
      }
      return response()->json($newSheetView, 200);
    }

    public function update(Request $request, SheetView $view)
    {
      $view->update($request->all());
      return response()->json(null, 200);
    }

    public function destroy(SheetView $view)
    {
      SheetFilter::where('sheetViewId', $view->id)->delete();
      SheetGroup::where('sheetViewId', $view->id)->delete();
      SheetSort::where('sheetViewId', $view->id)->delete();
      $view->delete();
      return response()->json(null, 204);
    }

    public function reset(SheetView $view)
    {
      SheetFilter::where('sheetViewId', $view->id)->delete();
      SheetGroup::where('sheetViewId', $view->id)->delete();
      SheetSort::where('sheetViewId', $view->id)->delete();
      return response()->json(null, 204);
    }
}
