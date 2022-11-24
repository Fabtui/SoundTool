class CreateAudios < ActiveRecord::Migration[7.0]
  def change
    create_table :audios do |t|
      t.string :title
      t.string :public_id
      t.string :content
      t.timestamps
    end
  end
end
