class ItemsController < ApplicationController
  def create
    item = Item.new(name: params[:name], list_id: params[:list_id])
    item.save
  end

  private

  # def item_params
  #   params.require(:item).permit(:name)
  # end
end
