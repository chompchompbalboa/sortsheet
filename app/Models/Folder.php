<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Folder extends Model
{
  public $incrementing = false;

  protected $appends = ['folders', 'files'];
  protected $fillable = ['id', 'name', 'folderId'];
  protected $visible = ['id', 'name', 'folderId', 'folders', 'files'];

  public function folder() {
    return $this->belongsTo('App\Models\Folder', 'folderId');
  }
  
  public function folders() {
    return $this->hasMany('App\Models\Folder', 'folderId');
  }
  
  public function files() {
    return $this->hasMany('App\Models\File');
  }
}