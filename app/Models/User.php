<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

use App\Models\Folder;

class User extends Authenticatable
{
    use Notifiable;
    use Traits\UsesUuid;
  
    protected $fillable = [ 'name', 'email', 'password', 'folderId' ];
    protected $visible = [ 'id', 'name', 'email', 'active', 'color' ];
    protected $with = [ 'active', 'color' ];
  
    public function active() {
      return $this->hasOne('App\Models\UserActive', 'userId');
    }
  
    public function columnTypes() {
      $columnTypes = [];
      $dropdowns = $this->dropdowns()->get();
      foreach($dropdowns as $dropdown) {
        $columnTypes[$dropdown->id] = $dropdown;
      }
      return $columnTypes;
    }
  
    public function color() {
      return $this->hasOne('App\Models\UserColor', 'userId');
    }

    public function dropdowns() {
      return $this->hasMany('App\Models\SheetDropdown', 'userId');
    }
    
    public function folder() {
      return $this->belongsTo('App\Models\Folder', 'folderId');
    }
  
    public function organization() {
      return $this->belongsTo('App\Models\Organization', 'organizationId');
    }
}