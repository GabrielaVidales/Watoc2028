class EmptyStringToNoneMixin:
    """
    Mixin para convertir cadenas vacías "" a None en todos los campos.
    Útil para campos unique=True y blank=True.
    """
    def to_internal_value(self, data):
        data = data.copy()
        for key, value in data.items():
            if value == "":
                data[key] = None
        return super().to_internal_value(data)