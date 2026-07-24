from django.db.models import TextChoices
from django.utils.translation import gettext_lazy as _


class DietaryRestrictionsList(TextChoices):
    DEFAULT = "", _("Not set")
    VEGETARIAN = "veget", _("Vegetarian")
    VEGAN = "vegan", _("Vegan")
    GLUTEN_FREE = "glut", _("Gluten-free")
    HALAL = "halal", _("Halal")
    KOSHER = "kosher", _("Kosher")
    PALEO = "paleo", _("Paleo")
    PESCATARIAN = "fish", _("Pescatarian")
    OTHER = "other", _("Other restrictions")


class FoodAllergiesList(TextChoices):
    DEFAULT = "", _("Not set")
    MILK = "milk", _("Milk")
    EGGS = "eggs", _("Eggs")
    FISH = "fish", _("Fish")
    CRUSTACEAN = "crustacean", _("Crustacean")
    MOLLUSK = "mollusk", _("Mollusk")
    ALMOND = "almond", _("Almond")
    HAZELNUT = "hazelnut", _("Hazelnut")
    WALNUT = "walnut", _("Walnut")
    PEANUTS = "peanuts", _("Peanuts")
    WHEAT = "wheat", _("Wheat (Gluten)")
    SOYBEANS = "soybeans", _("Soybeans")
    OTHER = "other", _("Other")
