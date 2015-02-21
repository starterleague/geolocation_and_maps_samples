class CreatePlaces < ActiveRecord::Migration
  def change
    create_table :places do |t|
      t.string :address
      t.string :latitude
      t.string :longitude
      t.string :title

      t.timestamps null: false
    end
  end
end
